export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? "https://fitwear.tm-project.id.vn"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = "API_ERROR",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let apiToken: string | null = null;
const expirationListeners = new Set<() => void>();

export function setApiToken(token: string | null) {
  apiToken = token;
}

export function onSessionExpired(listener: () => void) {
  expirationListeners.add(listener);
  return () => {
    expirationListeners.delete(listener);
  };
}

export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new ApiError("API paths must begin with a single slash.", 0, "INVALID_PATH");
  }
  const token = apiToken;
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      credentials: "omit",
    });
  } catch (cause) {
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0,
      "NETWORK_ERROR",
      cause,
    );
  }

  if (response.status === 401 && token && token === apiToken) {
    apiToken = null;
    for (const listener of expirationListeners) listener();
  }
  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    throw new ApiError(
      response.ok
        ? "The server returned an invalid response."
        : `Request failed (${response.status}).`,
      response.status,
      "INVALID_RESPONSE",
    );
  }
  if (!response.ok) {
    const error = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
    throw new ApiError(
      typeof error.message === "string" ? error.message : `Request failed (${response.status}).`,
      response.status,
      typeof error.code === "string" ? error.code : "API_ERROR",
      data,
    );
  }
  return data as T;
}
