import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { projectsApi } from "@/lib/api/projects.api"
import type { PublishStatus, ProjectSummary } from "@/lib/api/types"
import { useAuth } from "@/providers/auth/auth.provider"

export function useProjectsListViewModel() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { can } = useAuth()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<PublishStatus | "">("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const listQuery = useQuery({
    queryKey: ["projects", "list", page, search, status],
    queryFn: () =>
      projectsApi.list({
        page,
        per_page: 15,
        search: search || undefined,
        status: status || undefined,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      toast.success("Projeto eliminado.")
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
      setDeleteId(null)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Erro ao eliminar.")
    },
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) => projectsApi.publish(id),
    onSuccess: () => {
      toast.success("Projeto publicado.")
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const archiveMutation = useMutation({
    mutationFn: (id: string) => projectsApi.archive(id),
    onSuccess: () => {
      toast.success("Projeto arquivado.")
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => projectsApi.duplicate(id),
    onSuccess: (res) => {
      toast.success("Projeto duplicado.")
      navigate(`/projects/${res.data.id}`)
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  return {
    projects: listQuery.data?.data ?? [],
    meta: listQuery.data?.meta ?? { total: 0, page: 1, per_page: 15 },
    isLoading: listQuery.isLoading,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    deleteId,
    setDeleteId,
    confirmDelete: () => deleteId && deleteMutation.mutate(deleteId),
    isDeleting: deleteMutation.isPending,
    publish: (id: string) => publishMutation.mutate(id),
    archive: (id: string) => archiveMutation.mutate(id),
    duplicate: (id: string) => duplicateMutation.mutate(id),
    canCreate: can("projects.create"),
    canUpdate: can("projects.update"),
    canDelete: can("projects.delete"),
    canPublish: can("projects.publish"),
    goToNew: () => navigate("/projects/new"),
    goToEdit: (project: ProjectSummary) => navigate(`/projects/${project.id}`),
  }
}
