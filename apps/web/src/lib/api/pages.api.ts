import { apiRequest } from "./client"
import type { PageDetail, PageSummary, PaginatedResponse } from "./types"

export const pagesApi = {
  home() {
    return apiRequest<{ data: PageDetail }>("/pages/home")
  },

  list(params?: { page?: number; per_page?: number }) {
    return apiRequest<PaginatedResponse<PageSummary>>("/pages", { params })
  },

  bySlug(slug: string) {
    return apiRequest<{ data: PageDetail }>(`/pages/${slug}`)
  },
}
