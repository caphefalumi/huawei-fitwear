import axios from "axios"
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? "https://fitwear.tm-project.id.vn"
).replace(/\/$/, "")

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = "API_ERROR",
    public readonly details?: unknown,
    public readonly retryAfterSec?: number,
  ) {
    super(message)
    this.name = "ApiError"
  }

  get retryable() {
    return this.code === "NETWORK_ERROR" || this.code === "TIMEOUT" || this.status >= 500
  }
}

export function apiErrorMessage(error: unknown, subject = "your data"): string {
  if (!(error instanceof ApiError)) {
    return subject === "that change"
      ? "Couldn't save your change. Try again."
      : `Couldn't load ${subject}. Try again.`
  }
  if (error.status === 0 && error.code === "TIMEOUT") {
    return `Loading ${subject} took too long. Try again.`
  }
  if (error.status === 0 || error.code === "NETWORK_ERROR") {
    return `Couldn't connect to load ${subject}. Check your connection and try again.`
  }
  if (error.status === 401) return "Your session expired. Sign in again."
  if (error.status === 403) return "You don't have access to this information."
  if (error.status === 404) return "This item no longer exists."
  if (error.status === 429) return "Too many requests. Wait a moment, then try again."
  if (error.status === 400 || error.status === 422) {
    return "Some information needs attention. Check the fields and try again."
  }
  if (error.status >= 500) return "Something went wrong on our end. Try again."
  return `Couldn't load ${subject}. Try again.`
}

const REQUEST_TIMEOUT_MS = 12_000
let apiToken: string | null = null
const expirationListeners = new Set<() => void>()
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: REQUEST_TIMEOUT_MS,
})

// Capture the bearer before dispatch; sign-out may clear it in the same turn.
apiClient.interceptors.request.use(
  (config) => {
    if (apiToken) config.headers.set("Authorization", `Bearer ${apiToken}`)
    return config
  },
  undefined,
  { synchronous: true },
)

function retryAfterSeconds(details: unknown, header: unknown): number | undefined {
  if (details && typeof details === "object" && "retryAfterSec" in details) {
    const seconds = details.retryAfterSec
    if (typeof seconds === "number" && Number.isFinite(seconds) && seconds >= 0) {
      return Math.ceil(seconds)
    }
  }
  if (typeof header !== "string") return undefined
  const value = header.trim()
  if (/^\d+$/.test(value)) {
    const seconds = Number(value)
    return Number.isFinite(seconds) ? seconds : undefined
  }
  if (/^[+-]?\d/.test(value)) return undefined
  const deadline = Date.parse(value)
  return Number.isFinite(deadline)
    ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
    : undefined
}

apiClient.interceptors.response.use(undefined, (cause: unknown) => {
  // Aborts are not connection failures and must remain recognizable to Query.
  if (axios.isCancel(cause)) return Promise.reject(cause)
  if (!axios.isAxiosError(cause)) return Promise.reject(cause)

  const response = cause.response
  if (response) {
    if (
      response.status === 401 &&
      apiToken &&
      cause.config?.headers.get("Authorization") === `Bearer ${apiToken}`
    ) {
      apiToken = null
      for (const listener of expirationListeners) listener()
    }
    const data: unknown = response.data
    const error = data && typeof data === "object" ? (data as Record<string, unknown>) : {}
    return Promise.reject(
      new ApiError(
        typeof error.message === "string" ? error.message : "The request could not be completed.",
        response.status,
        typeof error.code === "string" ? error.code : "API_ERROR",
        data,
        retryAfterSeconds(data, response.headers["retry-after"]),
      ),
    )
  }
  if (cause.code === "ECONNABORTED" || cause.code === "ETIMEDOUT") {
    return Promise.reject(new ApiError("The request timed out.", 0, "TIMEOUT"))
  }
  return Promise.reject(
    new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0,
      "NETWORK_ERROR",
    ),
  )
})

export function setApiToken(token: string | null) {
  apiToken = token
}

export function onSessionExpired(listener: () => void) {
  expirationListeners.add(listener)
  return () => {
    expirationListeners.delete(listener)
  }
}

export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new ApiError("API paths must begin with a single slash.", 0, "INVALID_PATH")
  }
  const response = await apiClient.request<T>({
    url: path,
    method: options.method ?? "GET",
    data: options.body,
    headers: {
      Accept: "application/json",
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    signal: options.signal,
  })
  return response.data
}
