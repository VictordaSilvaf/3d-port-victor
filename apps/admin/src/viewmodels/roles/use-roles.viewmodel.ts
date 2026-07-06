import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { usersApi } from "@/lib/api/users.api"
import { useAuth } from "@/providers/auth/auth.provider"

export function useRolesViewModel() {
  const queryClient = useQueryClient()
  const { can } = useAuth()
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleSlug, setNewRoleSlug] = useState("")
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: async () => (await usersApi.roles()).data,
  })

  const permissionsQuery = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => (await usersApi.permissions()).data,
  })

  const createMutation = useMutation({
    mutationFn: () =>
      usersApi.createRole({ name: newRoleName, slug: newRoleSlug }),
    onSuccess: () => {
      toast.success("Role criada.")
      setNewRoleName("")
      setNewRoleSlug("")
      void queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.deleteRole(id),
    onSuccess: () => {
      toast.success("Role eliminada.")
      setSelectedRoleId(null)
      void queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const syncMutation = useMutation({
    mutationFn: () =>
      usersApi.syncRolePermissions(selectedRoleId!, selectedPermissions),
    onSuccess: () => {
      toast.success("Permissões actualizadas.")
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  useEffect(() => {
    setSelectedPermissions([])
  }, [selectedRoleId])

  function togglePermission(id: string) {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return {
    roles: rolesQuery.data ?? [],
    permissions: permissionsQuery.data ?? [],
    isLoading: rolesQuery.isLoading,
    newRoleName,
    setNewRoleName,
    newRoleSlug,
    setNewRoleSlug,
    createRole: () => createMutation.mutate(),
    isCreating: createMutation.isPending,
    deleteRole: (id: string) => deleteMutation.mutate(id),
    selectedRoleId,
    setSelectedRoleId,
    selectedPermissions,
    togglePermission,
    savePermissions: () => syncMutation.mutate(),
    isSavingPermissions: syncMutation.isPending,
    canCreate: can("roles.create"),
    canDelete: can("roles.delete"),
    canAssign: can("roles.assign_permissions"),
  }
}
