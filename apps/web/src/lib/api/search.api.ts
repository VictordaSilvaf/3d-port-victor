import { apiRequest } from "./client"
import type { PaginatedMeta, ProjectSummary } from "./types"

export const searchApi = {
  search(q: string, params?: { page?: number; per_page?: number }) {
    return apiRequest<{
      projects: ProjectSummary[]
      meta: PaginatedMeta
    }>("/search", {
      params: { q, ...params },
    })
  },
}
