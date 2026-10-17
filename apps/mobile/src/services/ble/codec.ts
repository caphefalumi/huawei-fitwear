const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function encodeUtf8Bytes(text: string): Uint8Array {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return new Uint8Array(bytes);
}

export function decodeUtf8Bytes(bytes: Uint8Array): string {
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const c = bytes[i++];
    if (c < 0x80) {
      out += String.fromCharCode(c);
    } else if ((c & 0xe0) === 0xc0 && i < bytes.length) {
      const c2 = bytes[i++] & 0x3f;
      out += String.fromCharCode(((c & 0x1f) << 6) | c2);
    } else if ((c & 0xf0) === 0xe0 && i + 1 < bytes.length) {
      const c2 = bytes[i++] & 0x3f;
      const c3 = bytes[i++] & 0x3f;
      out += String.fromCharCode(((c & 0x0f) << 12) | (c2 << 6) | c3);
    }
  }
  return out;
}

export function bytesToBase64(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const hasB1 = i + 1 < bytes.length;
    const hasB2 = i + 2 < bytes.length;
    const b1 = hasB1 ? bytes[i + 1] : 0;
    const b2 = hasB2 ? bytes[i + 2] : 0;

    out += BASE64_CHARS[b0 >> 2];
    out += BASE64_CHARS[((b0 & 0x03) << 4) | (b1 >> 4)];
    out += hasB1 ? BASE64_CHARS[((b1 & 0x0f) << 2) | (b2 >> 6)] : '=';
    out += hasB2 ? BASE64_CHARS[b2 & 0x3f] : '=';
  }
  return out;
}

export function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/[^A-Za-z0-9+/=]/g, '');
  const out: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const c0 = BASE64_CHARS.indexOf(clean[i]);
    const c1 = BASE64_CHARS.indexOf(clean[i + 1]);
    const c2 = clean[i + 2] === '=' ? -1 : BASE64_CHARS.indexOf(clean[i + 2]);
    const c3 = clean[i + 3] === '=' ? -1 : BASE64_CHARS.indexOf(clean[i + 3]);
    if (c0 < 0 || c1 < 0) break;
    out.push((c0 << 2) | (c1 >> 4));
    if (c2 >= 0) {
      out.push(((c1 & 0x0f) << 4) | (c2 >> 2));
      if (c3 >= 0) {
        out.push(((c2 & 0x03) << 6) | c3);
      }
    }
  }
  return new Uint8Array(out);
}

const SAMPLE_CHECK = 'Rep 10 | HR 142 bpm';
if (decodeUtf8Bytes(base64ToBytes(bytesToBase64(encodeUtf8Bytes(SAMPLE_CHECK)))) !== SAMPLE_CHECK) {
  throw new Error('BLE UTF-8/Base64 codec self-check failed');
}
