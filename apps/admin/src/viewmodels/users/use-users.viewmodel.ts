import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { usersApi } from "@/lib/api/users.api"
import type { UserSummary } from "@/lib/api/types"
import { useAuth } from "@/providers/auth/auth.provider"

export function useUsersListViewModel() {
  const navigate = useNavigate()
  const { can } = useAuth()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const listQuery = useQuery({
    queryKey: ["users", page, search],
    queryFn: () =>
      usersApi.list({ page, per_page: 15, search: search || undefined }),
  })

  return {
    users: listQuery.data?.items ?? [],
    total: listQuery.data?.total ?? 0,
    isLoading: listQuery.isLoading,
    page,
    setPage,
    search,
    setSearch,
    canCreate: can("users.create"),
    goToDetail: (user: UserSummary) => navigate(`/users/${user.id}`),
  }
}

export function useUserDetailViewModel() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { can } = useAuth()

  const userQuery = useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.get(id!),
    enabled: !!id,
  })

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: async () => (await usersApi.roles()).data,
  })

  const assignMutation = useMutation({
    mutationFn: (role_ids: string[]) => usersApi.assignRoles(id!, role_ids),
    onSuccess: () => {
      toast.success("Roles atualizadas.")
      void queryClient.invalidateQueries({ queryKey: ["users", id] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  useEffect(() => {
    const user = userQuery.data
    if (!user || !rolesQuery.data) return
    const ids = rolesQuery.data
      .filter((r) => user.roles.includes(r.slug) || user.roles.includes(r.name))
      .map((r) => r.id)
    setSelectedRoles(ids)
  }, [userQuery.data, rolesQuery.data])

  function toggleRole(roleId: string) {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((x) => x !== roleId) : [...prev, roleId]
    )
  }

  return {
    user: userQuery.data,
    roles: rolesQuery.data ?? [],
    isLoading: userQuery.isLoading,
    selectedRoles,
    toggleRole,
    saveRoles: () => assignMutation.mutate(selectedRoles),
    isSaving: assignMutation.isPending,
    canAssign: can("users.assign_roles"),
  }
}
