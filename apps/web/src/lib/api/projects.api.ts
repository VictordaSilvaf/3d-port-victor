import { apiRequest } from "./client"
import type {
  PaginatedResponse,
  ProjectDetail,
  ProjectSummary,
  ProjectsListParams,
  TaxonomyItem,
} from "./types"

export const projectsApi = {
  list(params?: ProjectsListParams) {
    return apiRequest<PaginatedResponse<ProjectSummary>>("/projects", {
      params: params as Record<string, string | number | boolean | undefined>,
    })
  },

  bySlug(slug: string) {
    return apiRequest<{ data: ProjectDetail }>(`/projects/${slug}`)
  },

  related(slug: string) {
    return apiRequest<{ data: ProjectSummary[] }>(`/projects/${slug}/related`)
  },

  categories() {
    return apiRequest<{ data: TaxonomyItem[] }>("/categories")
  },

  technologies() {
    return apiRequest<{ data: TaxonomyItem[] }>("/technologies")
  },

  tags() {
    return apiRequest<{ data: TaxonomyItem[] }>("/tags")
  },
}
