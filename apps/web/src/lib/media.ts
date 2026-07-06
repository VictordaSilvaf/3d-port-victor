export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith("http://") || path.startsWith("https://")) return path

  const cdn = import.meta.env.VITE_CDN_URL
  if (cdn) return `${cdn.replace(/\/$/, "")}/${path.replace(/^\//, "")}`

  const apiBase = import.meta.env.VITE_API_URL ?? "/api/v1"
  if (apiBase.startsWith("http")) {
    const origin = new URL(apiBase).origin
    return `${origin}/${path.replace(/^\//, "")}`
  }

  return `/${path.replace(/^\//, "")}`
}
