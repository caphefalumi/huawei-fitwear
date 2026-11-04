import axios, { AxiosError } from "axios";
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

  get retryable() {
    return (
      this.code === "NETWORK_ERROR" ||
      this.code === "TIMEOUT" ||
      this.status >= 500
    );
  }
}

export function apiErrorMessage(error: unknown, subject = "your data"): string {
  if (!(error instanceof ApiError)) {
    return subject === "that change"
      ? "Couldn't save your change. Try again."
      : `Couldn't load ${subject}. Try again.`;
  }
  if (error.status === 0 && error.code === "TIMEOUT") {
    return `Loading ${subject} took too long. Try again.`;
  }
  if (error.status === 0 || error.code === "NETWORK_ERROR") {
    return `Couldn't connect to load ${subject}. Check your connection and try again.`;
  }
  if (error.status === 401) return "Your session expired. Sign in again.";
  if (error.status === 403) return "You don't have access to this information.";
  if (error.status === 404) return "This item no longer exists.";
  if (error.status === 429) return "Too many requests. Wait a moment, then try again.";
  if (error.status === 400 || error.status === 422) {
    return "Some information needs attention. Check the fields and try again.";
  }
  if (error.status >= 500) return "Something went wrong on our end. Try again.";
  return `Couldn't load ${subject}. Try again.`;
}

const REQUEST_TIMEOUT_MS = 12_000;

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
  options: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new ApiError("API paths must begin with a single slash.", 0, "INVALID_PATH");
  }
  const token = apiToken;
  try {
    const response = await axios.request<unknown>({
      baseURL: API_BASE_URL,
      url: path,
      method: options.method ?? "GET",
      data: options.body,
      headers: {
        Accept: "application/json",
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: false,
      signal: options.signal,
      timeout: REQUEST_TIMEOUT_MS,
      validateStatus: () => true,
    });
    if (response.status === 401 && token && token === apiToken) {
      apiToken = null;
      for (const listener of expirationListeners) listener();
    }
    if (response.status < 200 || response.status >= 300) {
      const data = response.data;
      const error = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
      throw new ApiError(
        typeof error.message === "string" ? error.message : "The request could not be completed.",
        response.status,
        typeof error.code === "string" ? error.code : "API_ERROR",
        data,
      );
    }
    return response.data as T;
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    if (axios.isCancel(cause)) throw cause;
    if (
      cause instanceof AxiosError &&
      cause.code &&
      ["ECONNABORTED", "ETIMEDOUT"].includes(cause.code)
    ) {
      throw new ApiError("The request timed out.", 0, "TIMEOUT", cause);
    }
    if (cause instanceof AxiosError && cause.response) {
      throw new ApiError(
        "The request could not be completed.",
        cause.response.status,
        "API_ERROR",
        cause.response.data,
      );
    }
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0,
      "NETWORK_ERROR",
      cause,
    );
  }
}
