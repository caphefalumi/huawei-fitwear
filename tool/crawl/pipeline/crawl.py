#!/usr/bin/env python3
# Guide to use:
# Update categories.json, which configs the items to crawl, and start appeared in `python crawl.py list`

"""
Image crawl pipeline (Bing Images -> download -> dedupe -> contact sheets -> labelled output).

Quick usage (run from this folder):
    python crawl.py list                      # show configured categories
    python crawl.py run pho                   # search + download + contact sheets for one category
    python crawl.py run all                   # same, for every category in categories.json
    python crawl.py run pho --count 40        # override TARGET_COUNT for this run
    python crawl.py finalize pho              # copy the images listed in work/pho/labels.csv
                                              # into ../crawled/pho as m01-pho-600g.jpg ...

See README.md for the full workflow.
"""

# =============================================================================
# HYPERPARAMETERS  (edit here)
# =============================================================================
# --- how many images ---------------------------------------------------------
TARGET_COUNT = 30            # final images wanted per category
CANDIDATE_MULTIPLIER = 1.6   # download TARGET_COUNT * this, so there is spare to reject bad ones
MAX_CANDIDATE_URLS = 400     # stop searching once this many candidate URLs were found

# --- search (Bing Images) ----------------------------------------------------
SAFESEARCH = "strict"        # "strict" | "moderate" | "off"  (keep "strict": unfiltered results drift to adult content)
RESULTS_PER_PAGE = 35        # Bing returns up to ~35 per page
MAX_PAGES_PER_QUERY = 3      # pages per query (page n starts at 1 + n * RESULTS_PER_PAGE)
REQUEST_DELAY = 1.5          # seconds between search requests (raise this if Bing returns 0 results)
SEARCH_RETRIES = 2           # retries per failed/empty search request
BAD_REGEX = r"video|youtube|ytimg|nude|sexy|logo|vector|clipart|icon|svg|infographic|sticker|poster|menu|giá"
                             # title/URL words that disqualify a result (category files can add more)

# --- download ----------------------------------------------------------------
WORKERS = 12                 # parallel download threads
DOWNLOAD_TIMEOUT = 12        # seconds per image
MIN_BYTES = 8000             # drop files smaller than this (thumbnails, tracking pixels)
MIN_SIDE = 200               # drop images whose shorter side is below this many pixels
DEDUP = True                 # drop near-duplicate images (perceptual hash)
DEDUP_THRESHOLD = 5          # max Hamming distance (0-64) to count as duplicate; lower = stricter

# --- review contact sheets ---------------------------------------------------
SHEET_COLS = 5
SHEET_ROWS = 4
SHEET_THUMB = 240            # thumbnail size in pixels (square cell)

# --- final naming ------------------------------------------------------------
ID_PREFIX = "m"              # m01, m02, ...
ID_DIGITS = 2                # 2 -> m01, 3 -> m001
OVERWRITE_OUTPUT = False     # True: allow finalize to write into a non-empty output folder

# --- paths (relative to this file) -------------------------------------------
CATEGORIES_FILE = "categories.json"
WORK_DIR = "work"            # candidates, raw downloads, sheets, labels.csv
OUTPUT_ROOT = "../crawled"   # final labelled images go to OUTPUT_ROOT/<category folder>

USER_AGENT = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")
# =============================================================================

import argparse
import csv
import html
import http.cookiejar
import io
import json
import math
import re
import shutil
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    sys.exit("Pillow is required:  pip install -r requirements.txt")

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = Path(__file__).resolve().parent
WORK = HERE / WORK_DIR
OUT_ROOT = (HERE / OUTPUT_ROOT).resolve()
ADLT = {"strict": "STRICT", "moderate": "DEMOTE", "off": "OFF"}


def load_categories():
    path = HERE / CATEGORIES_FILE
    if not path.exists():
        sys.exit("Missing %s" % path)
    return json.loads(path.read_text(encoding="utf-8"))


def get_category(cats, key):
    if key not in cats:
        sys.exit("Unknown category '%s'. Available: %s" % (key, ", ".join(cats)))
    return cats[key]


# ------------------------------------------------------------------ search ----
_opener = None


def new_session():
    """Browser-like session: Bing gives poor, off-topic results to cookie-less script requests."""
    global _opener
    jar = http.cookiejar.CookieJar()
    _opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    try:
        _opener.open(urllib.request.Request("https://www.bing.com/images/search?q=food&form=HDRSC3",
                                            headers={"User-Agent": USER_AGENT}), timeout=20).read()
    except Exception as exc:
        print("    warm-up error: %s" % exc)
    jar.set_cookie(http.cookiejar.Cookie(
        0, "SRCHHPGUSR", "ADLT=%s" % ADLT[SAFESEARCH], None, False, ".bing.com", True, True,
        "/", True, False, None, False, None, None, {}))
    return _opener


def bing_page(query, first):
    url = ("https://www.bing.com/images/async?q=%s&first=%d&count=%d&mmasync=1&adlt=%s"
           % (urllib.parse.quote(query), first, RESULTS_PER_PAGE, SAFESEARCH))
    headers = {"User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
               "Referer": "https://www.bing.com/images/search?q=" + urllib.parse.quote(query)}
    for attempt in range(SEARCH_RETRIES + 1):
        try:
            opener = _opener or new_session()
            text = opener.open(urllib.request.Request(url, headers=headers), timeout=20).read().decode("utf8", "ignore")
            items = []
            for m in re.finditer(r'm="(\{.*?\})"', text):
                try:
                    d = json.loads(html.unescape(m.group(1)))
                except ValueError:
                    continue
                if d.get("murl"):
                    items.append((d["murl"], re.sub(r"<.*?>", "", d.get("t", ""))))
            if items:
                return items
        except Exception as exc:  # network error, throttling, ...
            print("    search error: %s" % exc)
        time.sleep(REQUEST_DELAY * (attempt + 2))
        new_session()  # fresh cookies before retrying
    return []


def search(key, cat):
    wdir = WORK / key
    wdir.mkdir(parents=True, exist_ok=True)
    include = re.compile(cat.get("include_regex", "."), re.I)
    bad = re.compile(BAD_REGEX + ("|" + cat["exclude_regex"] if cat.get("exclude_regex") else ""), re.I)
    seen, urls = set(), []
    for q in cat["queries"]:
        got = 0
        for page in range(MAX_PAGES_PER_QUERY):
            time.sleep(REQUEST_DELAY)
            for url, title in bing_page(q, 1 + page * RESULTS_PER_PAGE):
                if url in seen or not re.search(r"\.(jpe?g|png|webp)", url, re.I):
                    continue
                if not include.search(title + " " + url) or bad.search(title + " " + url):
                    continue
                seen.add(url)
                urls.append(url)
                got += 1
        print("  query %-45r -> %d new" % (q, got))
        if len(urls) >= MAX_CANDIDATE_URLS:
            break
    (wdir / "candidates.txt").write_text("\n".join(urls), encoding="utf-8")
    print("[%s] %d candidate URLs -> %s" % (key, len(urls), wdir / "candidates.txt"))
    if not urls:
        print("  0 results: Bing may be throttling. Raise REQUEST_DELAY, wait a few minutes, "
              "or put your own URLs in work/%s/extra_urls.txt (one per line)." % key)
    return urls


# ---------------------------------------------------------------- download ----
def on_white(im):
    im = im.convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    return bg.convert("RGB")


def dhash(im):
    px = list(on_white(im).convert("L").resize((9, 8)).tobytes())
    bits = 0
    for r in range(8):
        for c in range(8):
            bits = (bits << 1) | (px[r * 9 + c] > px[r * 9 + c + 1])
    return bits


def fetch(url):
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": USER_AGENT}),
                                   timeout=DOWNLOAD_TIMEOUT)
        data = r.read()
        if len(data) < MIN_BYTES or not r.headers.get("Content-Type", "").startswith("image"):
            return None
        im = Image.open(io.BytesIO(data))
        im.load()
        if min(im.size) < MIN_SIDE:
            return None
        return data, im
    except Exception:
        return None


def download(key, cat, count):
    wdir = WORK / key
    cand = wdir / "candidates.txt"
    urls = []
    extra = wdir / "extra_urls.txt"
    if extra.exists():
        urls += [u.strip() for u in extra.read_text(encoding="utf-8").splitlines() if u.strip()]
    if cand.exists():
        urls += [u for u in cand.read_text(encoding="utf-8").splitlines() if u]
    urls = list(dict.fromkeys(urls))
    if not urls:
        sys.exit("[%s] no candidate URLs; run the search step first." % key)
    want = math.ceil(count * CANDIDATE_MULTIPLIER)
    raw = wdir / "raw"
    if raw.exists():
        shutil.rmtree(raw)
    raw.mkdir(parents=True)
    kept, hashes = [], []
    dup = 0
    with ThreadPoolExecutor(WORKERS) as ex:
        results = ex.map(fetch, urls)
        for url, res in zip(urls, results):
            if res is None or len(kept) >= want:
                continue
            data, im = res
            if DEDUP:
                h = dhash(im)
                if any(bin(h ^ o).count("1") <= DEDUP_THRESHOLD for o in hashes):
                    dup += 1
                    continue
                hashes.append(h)
            ext = ".png" if data[:4] == b"\x89PNG" else ".webp" if data[8:12] == b"WEBP" else ".jpg"
            name = "c%03d%s" % (len(kept) + 1, ext)
            (raw / name).write_bytes(data)
            kept.append({"file": name, "url": url, "width": im.size[0], "height": im.size[1], "bytes": len(data)})
    (wdir / "manifest.json").write_text(json.dumps(kept, indent=1, ensure_ascii=False), encoding="utf-8")
    print("[%s] downloaded %d images (wanted %d, %d near-duplicates dropped) -> %s"
          % (key, len(kept), want, dup, raw))
    if len(kept) < count:
        print("  WARNING: fewer than TARGET_COUNT=%d. Add queries in %s or URLs in extra_urls.txt."
              % (count, CATEGORIES_FILE))
    return kept


# ------------------------------------------------------------------- sheet ----
def sheets(key):
    wdir = WORK / key
    manifest = json.loads((wdir / "manifest.json").read_text(encoding="utf-8"))
    sdir = wdir / "sheets"
    if sdir.exists():
        shutil.rmtree(sdir)
    sdir.mkdir()
    per = SHEET_COLS * SHEET_ROWS
    cell = SHEET_THUMB
    for s in range(0, len(manifest), per):
        sheet = Image.new("RGB", (SHEET_COLS * cell, SHEET_ROWS * cell), (200, 200, 200))
        dr = ImageDraw.Draw(sheet)
        for i, item in enumerate(manifest[s:s + per]):
            im = on_white(Image.open(wdir / "raw" / item["file"]))
            im.thumbnail((cell - 6, cell - 6))
            x, y = (i % SHEET_COLS) * cell, (i // SHEET_COLS) * cell
            sheet.paste(im, (x + 3, y + 3))
            dr.rectangle([x + 3, y + 3, x + 36, y + 17], fill=(255, 255, 0))
            dr.text((x + 6, y + 5), item["file"][1:4], fill=(0, 0, 0))
        out = sdir / ("sheet_%d.jpg" % (s // per + 1))
        sheet.save(out, quality=85)
    print("[%s] contact sheets -> %s  (labels on thumbnails = number in cNNN)" % (key, sdir))
    # label template
    lab = wdir / "labels.csv"
    if not lab.exists():
        lab.write_text("file,value\n", encoding="utf-8")
        print("[%s] created empty %s (fill it after reviewing, see README)" % (key, lab))


# ---------------------------------------------------------------- finalize ----
def finalize(key, cat):
    wdir = WORK / key
    lab = wdir / "labels.csv"
    if not lab.exists():
        sys.exit("[%s] %s not found" % (key, lab))
    rows = [r for r in csv.DictReader(lab.open(encoding="utf-8")) if r.get("file", "").strip()]
    if not rows:
        sys.exit("[%s] labels.csv has no rows. Add lines like:  c003,600" % key)
    manifest = {m["file"][:-len(Path(m["file"]).suffix)]: m for m in
                json.loads((wdir / "manifest.json").read_text(encoding="utf-8"))}
    out = OUT_ROOT / cat["folder"]
    if out.exists() and any(out.iterdir()) and not OVERWRITE_OUTPUT:
        sys.exit("[%s] %s is not empty. Set OVERWRITE_OUTPUT = True to replace it." % (key, out))
    if out.exists() and OVERWRITE_OUTPUT:
        shutil.rmtree(out)
    out.mkdir(parents=True)
    with (out / "links.csv").open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["file", "url"])
        for n, r in enumerate(rows, 1):
            stem = r["file"].strip()
            stem = stem[:-len(Path(stem).suffix)] if Path(stem).suffix else stem
            item = manifest.get(stem)
            value = (r.get("value") or "").strip()
            if item is None:
                sys.exit("[%s] unknown file '%s' in labels.csv" % (key, r["file"]))
            if not value:
                sys.exit("[%s] row '%s' has no value" % (key, r["file"]))
            name = "%s%0*d-%s-%s%s%s" % (ID_PREFIX, ID_DIGITS, n, cat["name"], value, cat["unit"],
                                          Path(item["file"]).suffix)
            shutil.copy(wdir / "raw" / item["file"], out / name)
            w.writerow([name, item["url"]])
    print("[%s] wrote %d images -> %s" % (key, len(rows), out))


# --------------------------------------------------------------------- cli ----
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list", help="show categories")
    for name, hlp in [("search", "collect candidate URLs"), ("download", "download + dedupe candidates"),
                      ("sheet", "build review contact sheets"),
                      ("run", "search + download + sheet"), ("finalize", "apply labels.csv -> output folder")]:
        p = sub.add_parser(name, help=hlp)
        p.add_argument("category", help="category key from categories.json, or 'all' (not for finalize)")
        if name in ("run", "download"):
            p.add_argument("--count", type=int, default=TARGET_COUNT, help="override TARGET_COUNT")
    args = ap.parse_args()
    cats = load_categories()

    if args.cmd == "list":
        for k, c in cats.items():
            print("%-10s -> %s/  (%s, unit '%s', %d queries)" % (k, c["folder"], c["name"], c["unit"], len(c["queries"])))
        return

    keys = list(cats) if args.category == "all" else [args.category]
    if args.cmd == "finalize" and args.category == "all":
        sys.exit("finalize works on one category at a time")
    for key in keys:
        cat = get_category(cats, key)
        count = getattr(args, "count", TARGET_COUNT)
        print("== %s ==" % key)
        if args.cmd in ("search", "run"):
            search(key, cat)
        if args.cmd in ("download", "run"):
            download(key, cat, count)
        if args.cmd in ("sheet", "run"):
            sheets(key)
        if args.cmd == "finalize":
            finalize(key, cat)


if __name__ == "__main__":
    main()
