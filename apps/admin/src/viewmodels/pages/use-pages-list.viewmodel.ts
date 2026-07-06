import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { pagesApi } from "@/lib/api/pages.api"
import type { PageSummary } from "@/lib/api/types"
import { useAuth } from "@/providers/auth/auth.provider"

export function usePagesListViewModel() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { can } = useAuth()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const listQuery = useQuery({
    queryKey: ["pages", "list", page],
    queryFn: () => pagesApi.list({ page, per_page: 15 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pagesApi.delete(id),
    onSuccess: () => {
      toast.success("Página eliminada.")
      void queryClient.invalidateQueries({ queryKey: ["pages"] })
      setDeleteId(null)
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) => pagesApi.publish(id),
    onSuccess: () => {
      toast.success("Página publicada.")
      void queryClient.invalidateQueries({ queryKey: ["pages"] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  return {
    pages: listQuery.data?.data ?? [],
    meta: listQuery.data?.meta ?? { total: 0, page: 1, per_page: 15 },
    isLoading: listQuery.isLoading,
    page,
    setPage,
    deleteId,
    setDeleteId,
    confirmDelete: () => deleteId && deleteMutation.mutate(deleteId),
    isDeleting: deleteMutation.isPending,
    publish: (id: string) => publishMutation.mutate(id),
    canCreate: can("pages.create"),
    canDelete: can("pages.delete"),
    canPublish: can("pages.publish"),
    goToNew: () => navigate("/pages/new"),
    goToEdit: (p: PageSummary) => navigate(`/pages/${p.id}`),
  }
}
