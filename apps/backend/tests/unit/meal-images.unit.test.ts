import { describe, expect, it } from "bun:test";
import { decodeMealImage } from "../../src/lib/meal-images";

describe("Meal image input boundary", () => {
  const png =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZr8AAAAASUVORK5CYII=";
  it("decodes PNG bytes without changing their signature", () => {
    expect(Array.from(decodeMealImage({ data: png, mimeType: "image/png" }).slice(0, 8))).toEqual([
      137, 80, 78, 71, 13, 10, 26, 10,
    ]);
  });
  it("rejects mislabeled images and non-image payloads", () => {
    expect(() => decodeMealImage({ data: png, mimeType: "image/jpeg" })).toThrow();
    expect(() => decodeMealImage({ data: btoa("not an image"), mimeType: "image/png" })).toThrow();
    expect(() => decodeMealImage({ data: "invalid base64!", mimeType: "image/png" })).toThrow();
  });
  it("rejects oversized encoded images before decoding", () => {
    expect(() => decodeMealImage({ data: "A".repeat(8_000_001), mimeType: "image/png" })).toThrow();
  });
});
