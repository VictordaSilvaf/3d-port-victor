import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { pagesApi } from "@/lib/api/pages.api"
import { projectsApi } from "@/lib/api/projects.api"
import { formatDate, formatNumber } from "@/models/admin/admin.model"

export function useDashboardViewModel() {
  const navigate = useNavigate()

  const statisticsQuery = useQuery({
    queryKey: ["projects", "statistics"],
    queryFn: () => projectsApi.statistics(),
  })

  const recentProjectsQuery = useQuery({
    queryKey: ["projects", "recent"],
    queryFn: () =>
      projectsApi.list({
        per_page: 5,
        sort: "updated_at",
        direction: "desc",
      }),
  })

  const recentPagesQuery = useQuery({
    queryKey: ["pages", "recent"],
    queryFn: () => pagesApi.list({ per_page: 5 }),
  })

  const stats = statisticsQuery.data
  const statCards = stats
    ? [
        { label: "Publicados", value: formatNumber(stats.published) },
        { label: "Rascunhos", value: formatNumber(stats.draft) },
        { label: "Arquivados", value: formatNumber(stats.archived) },
        { label: "Visualizações", value: formatNumber(stats.views) },
        { label: "Destaques", value: formatNumber(stats.featured) },
      ]
    : []

  return {
    title: "Painel",
    subtitle: "Visão geral do portfólio e conteúdo.",
    statCards,
    isLoadingStats: statisticsQuery.isLoading,
    recentProjects: recentProjectsQuery.data?.data ?? [],
    isLoadingProjects: recentProjectsQuery.isLoading,
    recentPages: recentPagesQuery.data?.data ?? [],
    isLoadingPages: recentPagesQuery.isLoading,
    goToProject: (id: string) => navigate(`/projects/${id}`),
    goToPage: (id: string) => navigate(`/pages/${id}`),
    formatDate,
  }
}
