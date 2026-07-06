import { apiRequest } from "./client"
import type { Permission, Role, UserDetail, UserSummary } from "./types"

export type UsersListResponse = {
  total: number
  items: UserSummary[]
}

export const usersApi = {
  list(params?: { page?: number; per_page?: number; search?: string }) {
    return apiRequest<UsersListResponse>("/admin/users", {
      params: params as Record<string, string | number | boolean | undefined>,
    })
  },

  get(id: string) {
    return apiRequest<UserDetail>(`/admin/users/${id}`)
  },

  create(body: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) {
    return apiRequest<{ id: string; message: string }>("/admin/users", {
      method: "POST",
      body,
    })
  },

  update(id: string, body: { name?: string; email?: string }) {
    return apiRequest<{ message: string }>(`/admin/users/${id}`, {
      method: "PUT",
      body,
    })
  },

  assignRoles(id: string, role_ids: string[]) {
    return apiRequest<{ message: string }>(`/admin/users/${id}/roles`, {
      method: "PUT",
      body: { role_ids },
    })
  },

  roles() {
    return apiRequest<{ data: Role[] } | Role[]>("/admin/roles").then((res) =>
      Array.isArray(res) ? { data: res } : res
    )
  },

  createRole(body: { name: string; slug: string }) {
    return apiRequest<{ id: string; message: string }>("/admin/roles", {
      method: "POST",
      body,
    })
  },

  deleteRole(id: string) {
    return apiRequest<{ message: string }>(`/admin/roles/${id}`, {
      method: "DELETE",
    })
  },

  syncRolePermissions(id: string, permission_ids: string[]) {
    return apiRequest<{ message: string }>(
      `/admin/roles/${id}/permissions`,
      { method: "PUT", body: { permission_ids } }
    )
  },

  permissions() {
    return apiRequest<{ data: Permission[] }>("/admin/permissions")
  },
}
