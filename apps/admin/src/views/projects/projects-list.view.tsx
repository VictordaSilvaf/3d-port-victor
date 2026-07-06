import { MoreHorizontalIcon, PlusIcon } from "lucide-react"

import { Button } from "@workspace/ui/atoms/button"
import { Input } from "@workspace/ui/atoms/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/atoms/select"
import { ConfirmDialog } from "@workspace/ui/molecules/confirm-dialog"
import {
  DataTable,
  DataTablePagination,
  type DataTableColumn,
} from "@workspace/ui/molecules/data-table"
import { PageHeader } from "@workspace/ui/molecules/page-header"
import { StatusBadge } from "@workspace/ui/molecules/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/atoms/dropdown-menu"

import type { ProjectSummary, PublishStatus } from "@/lib/api/types"
import { formatDate } from "@/models/admin/admin.model"
import type { useProjectsListViewModel } from "@/viewmodels/projects/use-projects-list.viewmodel"

type ProjectsListViewProps = ReturnType<typeof useProjectsListViewModel>

export function ProjectsListView({
  projects,
  meta,
  isLoading,
  page,
  setPage,
  search,
  setSearch,
  status,
  setStatus,
  deleteId,
  setDeleteId,
  confirmDelete,
  isDeleting,
  publish,
  archive,
  duplicate,
  canCreate,
  canUpdate,
  canDelete,
  canPublish,
  goToNew,
  goToEdit,
}: ProjectsListViewProps) {
  const columns: DataTableColumn<ProjectSummary>[] = [
    {
      key: "title",
      header: "Título",
      cell: (row) => (
        <button
          type="button"
          className="hover:underline"
          onClick={() => goToEdit(row)}
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
      key: "featured",
      header: "Destaque",
      cell: (row) => (row.featured ? "Sim" : "—"),
    },
    {
      key: "views",
      header: "Views",
      cell: (row) => row.views,
    },
    {
      key: "updated",
      header: "Atualizado",
      cell: (row) => formatDate(row.updated_at),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canUpdate ? (
              <DropdownMenuItem onClick={() => goToEdit(row)}>
                Editar
              </DropdownMenuItem>
            ) : null}
            {canPublish && row.status !== "published" ? (
              <DropdownMenuItem onClick={() => publish(row.id)}>
                Publicar
              </DropdownMenuItem>
            ) : null}
            {canPublish && row.status === "published" ? (
              <DropdownMenuItem onClick={() => archive(row.id)}>
                Arquivar
              </DropdownMenuItem>
            ) : null}
            {canCreate ? (
              <DropdownMenuItem onClick={() => duplicate(row.id)}>
                Duplicar
              </DropdownMenuItem>
            ) : null}
            {canDelete ? (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteId(row.id)}
              >
                Eliminar
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Projetos"
        description="Gerir projetos do portfólio."
        actions={
          canCreate ? (
            <Button onClick={goToNew}>
              <PlusIcon data-icon="inline-start" />
              Novo projeto
            </Button>
          ) : null
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Pesquisar…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={status || "all"}
          onValueChange={(v) => {
            setStatus(v === "all" ? "" : (v as PublishStatus))
            setPage(1)
          }}
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
            <SelectItem value="archived">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
      />

      <DataTablePagination
        page={page}
        perPage={meta.per_page}
        total={meta.total}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar projeto"
        description="Esta ação move o projeto para a lixeira."
        confirmLabel="Eliminar"
        destructive
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  )
}
