import { apiRequest } from "./client"
import type { SiteSettings } from "./types"

export const siteSettingsApi = {
  get() {
    return apiRequest<{ data: SiteSettings }>("/site/settings")
  },
}
