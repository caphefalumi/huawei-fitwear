# Image crawl pipeline

Crawl ảnh từ Bing Images theo từ khóa, tải về, loại ảnh trùng, tạo contact sheet để duyệt bằng mắt, rồi đặt tên
theo dạng `m01-pho-600g.jpg` vào `../crawled/<category>/`.

```
pipeline/
  crawl.py           # code + HYPERPARAMETERS ở trên cùng file
  categories.json    # danh sách category: từ khóa, regex lọc, đơn vị (g/ml)
  requirements.txt   # Pillow
  work/<category>/   # tự sinh: candidates.txt, raw/, manifest.json, sheets/, labels.csv
```

## Cài đặt (1 lần)

```powershell
cd D:\Khanhs\Study\Projects\2026\ProjectA\crawl-data\pipeline
pip install -r requirements.txt
```

## HYPERPARAMETERS (đầu file `crawl.py`)

| Tên                                       | Mặc định               | Ý nghĩa                                                                              |
| ----------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------ |
| `TARGET_COUNT`                            | 30                     | Số ảnh cuối cùng mỗi category (ghi đè bằng `--count`)                                |
| `CANDIDATE_MULTIPLIER`                    | 1.6                    | Tải dư (30 × 1.6 = 48 ảnh) để còn loại ảnh xấu khi duyệt                             |
| `MAX_CANDIDATE_URLS`                      | 400                    | Dừng tìm kiếm khi đủ số URL này                                                      |
| `SAFESEARCH`                              | `"strict"`             | `strict` / `moderate` / `off`. Nên giữ `strict`, tắt đi kết quả bị lẫn ảnh người lớn |
| `MAX_PAGES_PER_QUERY`                     | 3                      | Số trang kết quả mỗi từ khóa (~35 ảnh/trang)                                         |
| `REQUEST_DELAY`                           | 1.5                    | Giây nghỉ giữa các request tìm kiếm. Tăng lên nếu Bing trả 0 kết quả                 |
| `SEARCH_RETRIES`                          | 2                      | Số lần thử lại khi request lỗi/rỗng                                                  |
| `BAD_REGEX`                               | video, logo, poster... | Từ trong tiêu đề/URL làm ảnh bị loại (mỗi category có thể thêm `exclude_regex`)      |
| `WORKERS`                                 | 12                     | Số luồng tải song song                                                               |
| `DOWNLOAD_TIMEOUT`                        | 12                     | Giây tối đa cho mỗi ảnh                                                              |
| `MIN_BYTES` / `MIN_SIDE`                  | 8000 / 200             | Loại ảnh quá nhỏ (dung lượng / cạnh ngắn, px)                                        |
| `DEDUP` / `DEDUP_THRESHOLD`               | True / 5               | Loại ảnh gần giống nhau (perceptual hash). Ngưỡng thấp = chặt hơn                    |
| `SHEET_COLS`, `SHEET_ROWS`, `SHEET_THUMB` | 5, 4, 240              | Kích thước contact sheet để duyệt                                                    |
| `ID_PREFIX`, `ID_DIGITS`                  | `m`, 2                 | Dạng id: `m01`; đặt 3 → `m001`                                                       |
| `OVERWRITE_OUTPUT`                        | False                  | False: từ chối ghi vào thư mục đích đã có ảnh                                        |
| `OUTPUT_ROOT`                             | `../crawled`           | Nơi lưu ảnh đã đặt tên                                                               |

## Quy trình

**1. Xem category có sẵn**

```powershell
python crawl.py list
```

**2. Crawl (tìm + tải + tạo contact sheet)**

```powershell
python crawl.py run pho
python crawl.py run all                 # tất cả category
python crawl.py run pho --count 40      # lấy 40 thay vì 30
```

Có thể chạy từng bước riêng: `search`, `download`, `sheet`.
Kết quả ở `work/pho/`: ảnh tải về trong `raw/` (đặt tên `c001.jpg`...), các bản xem nhanh trong `sheets/sheet_1.jpg`...
(số vàng trên mỗi ô là số trong tên `cNNN`).

**3. Duyệt ảnh**
Mở `work/<category>/sheets/`, chọn ảnh đúng chủ đề (bỏ ảnh banner có chữ, ảnh nhiều món, ảnh combo/thùng...).

**4. Ghi `work/<category>/labels.csv`**
Mỗi dòng một ảnh giữ lại, theo thứ tự muốn đánh số m01, m02...; cột `value` là gram hoặc ml (chỉ số, không kèm đơn vị):

```
file,value
c003,600
c004,550
c010,700
```

Đây là bước bạn sẽ nhờ Claude: đưa Claude xem contact sheet, Claude chọn ảnh và điền `labels.csv`.

**5. Xuất ảnh đã đặt tên**

```powershell
python crawl.py finalize pho
```

Ra `../crawled/pho/m01-pho-600g.jpg ...` kèm `links.csv` (tên file, URL gốc).

## Thêm category mới

Thêm một khối vào `categories.json`:

```json
"banh_mi": {
  "folder": "banh_mi",            // thư mục trong OUTPUT_ROOT
  "name": "banh_mi",              // phần name trong tên file
  "unit": "g",                    // g hoặc ml
  "queries": ["bánh mì thịt", "banh mi vietnamese sandwich"],
  "include_regex": "bánh mì|banh mi",   // tiêu đề/URL phải khớp (không phân biệt hoa thường)
  "exclude_regex": "pack|thùng"         // tiêu đề/URL khớp cái này thì bị loại
}
```

Mẹo: `include_regex` càng cụ thể thì càng ít ảnh rác; cho nhiều `queries` (cả tiếng Việt lẫn tiếng Anh) để đủ ảnh.

## Khi gặp vấn đề

- **Tìm kiếm trả 0 hoặc rất ít kết quả:** Bing đang giới hạn request. Tăng `REQUEST_DELAY` (3 đến 5), đợi vài phút rồi chạy lại,
  hoặc chạy từng category một thay vì `all`.
- **Kết quả lạc đề (ví dụ tìm "bánh căn" ra bánh chưng, bánh canh):** Bing trả kết quả kém cho request không có cookie. Pipeline đã tự
  mở phiên có cookie như trình duyệt. Nếu vẫn lạc đề, thêm từ khóa cụ thể hơn và siết `include_regex`.
- **Vẫn thiếu ảnh sau khi tải:** thêm `queries`, tăng `MAX_PAGES_PER_QUERY`, hoặc tăng `CANDIDATE_MULTIPLIER`.
- **Tự thêm URL ảnh:** tạo `work/<category>/extra_urls.txt` (mỗi dòng một URL), chạy lại `download`. Các URL này được ưu tiên trước.
- **Nhiều ảnh trùng nhau:** giảm `DEDUP_THRESHOLD` thấp xuống ít bị loại, hoặc tăng để loại mạnh tay hơn.
- **Một số ảnh lỗi 403:** trang nguồn chặn tải tự động, bị bỏ qua và lấy ảnh khác thay thế.

## Lưu ý

- Ảnh lấy từ web có bản quyền của chủ sở hữu và nhiều ảnh có watermark; `links.csv` ghi URL gốc để truy nguồn. Kiểm tra giấy phép
  trước khi dùng cho mục đích công khai hoặc thương mại.
- Gram/ml trong tên file là số ước lượng khi duyệt ảnh, không phải số đo thật.
