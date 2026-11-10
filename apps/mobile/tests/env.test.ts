import { validateApiUrl } from "@/config/env"

test("uses the production endpoint by default and accepts a local endpoint", () => {
  expect(validateApiUrl(undefined)).toBe("https://fitwear.tm-project.id.vn")
  expect(validateApiUrl("http://192.168.1.10:8787/")).toBe("http://192.168.1.10:8787")
})

test.each([
  "",
  "localhost:8787",
  "ftp://example.com",
  "https://user:pass@example.com",
  "https://example.com?token=x",
  "https://example.com/#fragment",
])("rejects invalid or unsafe API URL configuration: %s", (value) =>
  expect(() => validateApiUrl(value)).toThrow("EXPO_PUBLIC_API_URL"),
)
