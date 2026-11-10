const DEFAULT_API_URL = "https://fitwear.tm-project.id.vn"

export function validateApiUrl(value: string | undefined): string {
  const apiUrl = value ?? DEFAULT_API_URL
  let parsed: URL
  try {
    parsed = new URL(apiUrl)
  } catch {
    throw new Error("EXPO_PUBLIC_API_URL must be an absolute HTTP(S) URL")
  }
  if (
    (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
    !parsed.hostname ||
    /\s/.test(apiUrl) ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(
      "EXPO_PUBLIC_API_URL must be an absolute HTTP(S) URL without credentials, query, or fragment",
    )
  }
  return apiUrl.replace(/\/$/, "")
}

// Expo replaces statically referenced EXPO_PUBLIC_ variables at bundle time.
export const env = {
  apiUrl: validateApiUrl(process.env.EXPO_PUBLIC_API_URL),
}
