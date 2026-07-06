import { apiRequest } from "./client"
import type {
  BlockType,
  PageDetail,
  PageSummary,
  PagesListParams,
  PaginatedResponse,
} from "./types"

export const pagesApi = {
  list(params?: PagesListParams) {
    return apiRequest<PaginatedResponse<PageSummary>>("/admin/pages", {
      params: params as Record<string, string | number | boolean | undefined>,
    })
  },

  get(id: string, withTrashed = false) {
    return apiRequest<{ data: PageDetail }>(`/admin/pages/${id}`, {
      params: withTrashed ? { with_trashed: true } : undefined,
    })
  },

  create(body: Record<string, unknown>) {
    return apiRequest<{ data: PageDetail }>("/admin/pages", {
      method: "POST",
      body,
    })
  },

  update(id: string, body: Record<string, unknown>) {
    return apiRequest<{ data: PageDetail }>(`/admin/pages/${id}`, {
      method: "PUT",
      body,
    })
  },

  patch(id: string, body: Record<string, unknown>) {
    return apiRequest<{ data: PageDetail }>(`/admin/pages/${id}`, {
      method: "PATCH",
      body,
    })
  },

  publish(id: string, published_at?: string) {
    return apiRequest<{ data: PageDetail }>(`/admin/pages/${id}/publish`, {
      method: "PATCH",
      body: published_at ? { published_at } : {},
    })
  },

  archive(id: string) {
    return apiRequest<{ data: PageDetail }>(`/admin/pages/${id}/archive`, {
      method: "PATCH",
      body: {},
    })
  },

  draft(id: string) {
    return apiRequest<{ data: PageDetail }>(`/admin/pages/${id}/draft`, {
      method: "PATCH",
    })
  },

  delete(id: string) {
    return apiRequest<{ message: string }>(`/admin/pages/${id}`, {
      method: "DELETE",
    })
  },

  forceDelete(id: string) {
    return apiRequest<void>(`/admin/pages/${id}/force`, { method: "DELETE" })
  },

  restore(id: string) {
    return apiRequest<{ data: PageDetail }>(`/admin/pages/${id}/restore`, {
      method: "PATCH",
    })
  },

  duplicate(id: string) {
    return apiRequest<{ data: PageDetail }>(`/admin/pages/${id}/duplicate`, {
      method: "POST",
    })
  },

  reorder(items: Array<{ id: string; sort_order: number }>) {
    return apiRequest<{ message: string }>("/admin/pages/order", {
      method: "PATCH",
      body: { items },
    })
  },

  syncBlocks(id: string, blocks: Array<Record<string, unknown>>) {
    return apiRequest<{ data: PageDetail }>(`/admin/pages/${id}/blocks`, {
      method: "PUT",
      body: { blocks },
    })
  },

  blockTypes() {
    return apiRequest<{ data: BlockType[] }>("/block-types", { auth: false })
  },
}
