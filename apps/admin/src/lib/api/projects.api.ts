import { apiRequest } from "./client"
import type {
  PaginatedResponse,
  ProjectDetail,
  ProjectStatistics,
  ProjectSummary,
  ProjectsListParams,
  TaxonomyItem,
} from "./types"

export const projectsApi = {
  statistics() {
    return apiRequest<ProjectStatistics>("/admin/projects/statistics")
  },

  list(params?: ProjectsListParams) {
    return apiRequest<PaginatedResponse<ProjectSummary>>("/admin/projects", {
      params: params as Record<string, string | number | boolean | undefined>,
    })
  },

  get(id: string) {
    return apiRequest<{ data: ProjectDetail }>(`/admin/projects/${id}`)
  },

  create(body: Record<string, unknown>) {
    return apiRequest<{ data: ProjectDetail }>("/admin/projects", {
      method: "POST",
      body,
    })
  },

  update(id: string, body: Record<string, unknown>) {
    return apiRequest<{ data: ProjectDetail }>(`/admin/projects/${id}`, {
      method: "PUT",
      body,
    })
  },

  patch(id: string, body: Record<string, unknown>) {
    return apiRequest<{ data: ProjectDetail }>(`/admin/projects/${id}`, {
      method: "PATCH",
      body,
    })
  },

  publish(id: string, published_at?: string) {
    return apiRequest<{ data: ProjectDetail }>(
      `/admin/projects/${id}/publish`,
      {
        method: "PATCH",
        body: published_at ? { published_at } : {},
      }
    )
  },

  archive(id: string) {
    return apiRequest<{ data: ProjectDetail }>(
      `/admin/projects/${id}/archive`,
      { method: "PATCH", body: {} }
    )
  },

  draft(id: string) {
    return apiRequest<{ data: ProjectDetail }>(`/admin/projects/${id}/draft`, {
      method: "PATCH",
    })
  },

  delete(id: string) {
    return apiRequest<{ message: string }>(`/admin/projects/${id}`, {
      method: "DELETE",
    })
  },

  forceDelete(id: string) {
    return apiRequest<void>(`/admin/projects/${id}/force`, {
      method: "DELETE",
    })
  },

  restore(id: string) {
    return apiRequest<{ data: ProjectDetail }>(
      `/admin/projects/${id}/restore`,
      { method: "PATCH" }
    )
  },

  duplicate(id: string) {
    return apiRequest<{ data: ProjectDetail }>(
      `/admin/projects/${id}/duplicate`,
      { method: "POST" }
    )
  },

  reorder(projects: Array<{ id: string; order: number }>) {
    return apiRequest<{ message: string }>("/admin/projects/order", {
      method: "PATCH",
      body: { projects },
    })
  },

  addImage(id: string, image_id: string, caption?: string) {
    return apiRequest<{ id: string }>(`/admin/projects/${id}/images`, {
      method: "POST",
      body: { image_id, caption },
    })
  },

  removeImage(id: string, imageId: string) {
    return apiRequest<void>(`/admin/projects/${id}/images/${imageId}`, {
      method: "DELETE",
    })
  },

  reorderImages(
    id: string,
    images: Array<{ id: string; order: number }>
  ) {
    return apiRequest<void>(`/admin/projects/${id}/images/order`, {
      method: "PATCH",
      body: { images },
    })
  },

  setThumbnail(id: string, image_id: string) {
    return apiRequest<{ data: ProjectDetail }>(
      `/admin/projects/${id}/thumbnail`,
      { method: "PATCH", body: { image_id } }
    )
  },

  setCover(id: string, image_id: string) {
    return apiRequest<{ data: ProjectDetail }>(`/admin/projects/${id}/cover`, {
      method: "PATCH",
      body: { image_id },
    })
  },

  syncCategories(id: string, categories: string[]) {
    return apiRequest<{ data: ProjectDetail }>(
      `/admin/projects/${id}/categories`,
      { method: "PUT", body: { categories } }
    )
  },

  syncTechnologies(id: string, technologies: string[]) {
    return apiRequest<{ data: ProjectDetail }>(
      `/admin/projects/${id}/technologies`,
      { method: "PUT", body: { technologies } }
    )
  },

  syncTags(id: string, tags: string[]) {
    return apiRequest<{ data: ProjectDetail }>(`/admin/projects/${id}/tags`, {
      method: "PUT",
      body: { tags },
    })
  },

  categories() {
    return apiRequest<{ data: TaxonomyItem[] }>("/categories", { auth: false })
  },

  technologies() {
    return apiRequest<{ data: TaxonomyItem[] }>("/technologies", {
      auth: false,
    })
  },

  tags() {
    return apiRequest<{ data: TaxonomyItem[] }>("/tags", { auth: false })
  },
}
