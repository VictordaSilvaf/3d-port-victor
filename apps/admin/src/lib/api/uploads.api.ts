import { apiRequest } from "./client"
import type { SiteSettings, UploadResult } from "./types"

export const uploadsApi = {
  upload(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    return apiRequest<UploadResult>("/admin/uploads", {
      method: "POST",
      body: formData,
    })
  },
}

export const siteSettingsApi = {
  get() {
    return apiRequest<{ data: SiteSettings }>("/admin/site/settings")
  },

  update(body: Partial<SiteSettings>) {
    return apiRequest<{ data: SiteSettings }>("/admin/site/settings", {
      method: "PUT",
      body,
    })
  },
}
