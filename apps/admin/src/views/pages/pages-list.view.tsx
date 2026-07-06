import { MoreHorizontalIcon, PlusIcon } from "lucide-react"

import { Button } from "@workspace/ui/atoms/button"
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

import type { PageSummary } from "@/lib/api/types"
import type { usePagesListViewModel } from "@/viewmodels/pages/use-pages-list.viewmodel"

type PagesListViewProps = ReturnType<typeof usePagesListViewModel>

export function PagesListView({
  pages,
  meta,
  isLoading,
  page,
  setPage,
  deleteId,
  setDeleteId,
  confirmDelete,
  isDeleting,
  publish,
  canCreate,
  canDelete,
  canPublish,
  goToNew,
  goToEdit,
}: PagesListViewProps) {
  const columns: DataTableColumn<PageSummary>[] = [
    {
      key: "title",
      header: "Título",
      cell: (row) => (
        <button type="button" className="hover:underline" onClick={() => goToEdit(row)}>
          {row.title}
        </button>
      ),
    },
    { key: "slug", header: "Slug", cell: (row) => row.slug },
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
            <DropdownMenuItem onClick={() => goToEdit(row)}>Editar</DropdownMenuItem>
            {canPublish && row.status !== "published" ? (
              <DropdownMenuItem onClick={() => publish(row.id)}>Publicar</DropdownMenuItem>
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
        title="Páginas"
        description="Page builder e conteúdo do site."
        actions={
          canCreate ? (
            <Button onClick={goToNew}>
              <PlusIcon data-icon="inline-start" />
              Nova página
            </Button>
          ) : null
        }
      />
      <DataTable columns={columns} data={pages} isLoading={isLoading} getRowKey={(r) => r.id} />
      <DataTablePagination
        page={page}
        perPage={meta.per_page}
        total={meta.total}
        onPageChange={setPage}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar página"
        description="Esta ação move a página para a lixeira."
        confirmLabel="Eliminar"
        destructive
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  )
}
