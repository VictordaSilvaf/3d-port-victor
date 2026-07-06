import type { ApiError } from "./types"

const STORAGE_KEY = "web_access_token"

export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setAccessToken(token: string | null): void {
  if (token) localStorage.setItem(STORAGE_KEY, token)
  else localStorage.removeItem(STORAGE_KEY)
}

function getBaseUrl(): string {
  return import.meta.env.VITE_API_URL ?? "/api/v1"
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const base = getBaseUrl()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const url = base.startsWith("http")
    ? new URL(`${base.replace(/\/$/, "")}${normalizedPath}`)
    : new URL(`${base.replace(/\/$/, "")}${normalizedPath}`, window.location.origin)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  auth?: boolean
  params?: Record<string, string | number | boolean | undefined>
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = false, params, headers, ...rest } = options
  const url = buildUrl(path, params)
  const requestHeaders = new Headers(headers)

  if (auth) {
    const token = getAccessToken()
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`)
  }

  let requestBody: BodyInit | undefined
  if (body instanceof FormData) {
    requestBody = body
  } else if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json")
    requestBody = JSON.stringify(body)
  }

  const response = await fetch(url, { ...rest, headers: requestHeaders, body: requestBody })

  if (response.status === 204) return undefined as T

  const contentType = response.headers.get("content-type")
  const isJson = contentType?.includes("application/json")
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const error: ApiError = {
      message:
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: string }).message)
          : `Request failed (${response.status})`,
      errors:
        typeof data === "object" && data !== null && "errors" in data
          ? (data as { errors: Record<string, string[]> }).errors
          : undefined,
      status: response.status,
    }
    throw error
  }
  return data as T
}
