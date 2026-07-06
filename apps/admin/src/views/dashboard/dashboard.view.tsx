import { Link } from "react-router-dom"

import { Button } from "@workspace/ui/atoms/button"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import {
  DataTable,
  type DataTableColumn,
} from "@workspace/ui/molecules/data-table"
import { PageHeader } from "@workspace/ui/molecules/page-header"
import { StatCard } from "@workspace/ui/molecules/stat-card"
import { StatusBadge } from "@workspace/ui/molecules/status-badge"

import type { PageSummary, ProjectSummary } from "@/lib/api/types"
import type { useDashboardViewModel } from "@/viewmodels/dashboard/use-dashboard.viewmodel"

type DashboardViewProps = ReturnType<typeof useDashboardViewModel>

export function DashboardView({
  title,
  subtitle,
  statCards,
  isLoadingStats,
  recentProjects,
  isLoadingProjects,
  recentPages,
  isLoadingPages,
  goToProject,
  goToPage,
  formatDate,
}: DashboardViewProps) {
  const projectColumns: DataTableColumn<ProjectSummary>[] = [
    {
      key: "title",
      header: "Título",
      cell: (row) => (
        <button
          type="button"
          className="hover:underline"
          onClick={() => goToProject(row.id)}
        >
          {row.title}
        </button>
      ),
    },
    {
      key: "status",
      header: "Estado",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "updated",
      header: "Atualizado",
      cell: (row) => formatDate(row.updated_at),
    },
  ]

  const pageColumns: DataTableColumn<PageSummary>[] = [
    {
      key: "title",
      header: "Título",
      cell: (row) => (
        <button
          type="button"
          className="hover:underline"
          onClick={() => goToPage(row.id)}
        >
          {row.title}
        </button>
      ),
    },
    {
      key: "status",
      header: "Estado",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "home",
      header: "Home",
      cell: (row) => (row.is_home ? "Sim" : "—"),
    },
  ]

  return (
    <>
      <PageHeader title={title} description={subtitle} />

      <section className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {isLoadingStats
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))
            : statCards.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Projetos recentes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/projects">Ver todos</Link>
            </Button>
          </div>
          <DataTable
            columns={projectColumns}
            data={recentProjects}
            isLoading={isLoadingProjects}
            getRowKey={(row) => row.id}
            emptyMessage="Sem projetos."
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Páginas recentes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/pages">Ver todas</Link>
            </Button>
          </div>
          <DataTable
            columns={pageColumns}
            data={recentPages}
            isLoading={isLoadingPages}
            getRowKey={(row) => row.id}
            emptyMessage="Sem páginas."
          />
        </section>
      </div>
    </>
  )
}
