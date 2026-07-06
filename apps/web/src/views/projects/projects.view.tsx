import { Button } from "@workspace/ui/atoms/button"
import { Input } from "@workspace/ui/atoms/input"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { DataTablePagination } from "@workspace/ui/molecules/data-table"
import { ProjectFeedCard } from "@workspace/ui/molecules/project-feed-card"

import type { useProjectsViewModel } from "@/viewmodels/projects/use-projects.viewmodel"

type ProjectsViewProps = ReturnType<typeof useProjectsViewModel>

export function ProjectsView({
  projects,
  meta,
  isLoading,
  search,
  setSearch,
  applySearch,
  page,
  setPage,
  resolveMediaUrl,
}: ProjectsViewProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Projetos</h1>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            applySearch()
          }}
        >
          <Input
            placeholder="Pesquisar…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm border-white/20 bg-white/10 text-white"
          />
          <Button type="submit" variant="secondary">
            Filtrar
          </Button>
        </form>
      </header>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectFeedCard
              key={p.id}
              title={p.title}
              href={`/projects/${p.slug}`}
              description={p.description}
              imageUrl={resolveMediaUrl(p.cover ?? p.thumbnail)}
              views={p.views}
              featured={p.featured}
            />
          ))}
        </div>
      )}

      <DataTablePagination
        page={page}
        perPage={meta.per_page}
        total={meta.total}
        onPageChange={setPage}
      />
    </div>
  )
}
