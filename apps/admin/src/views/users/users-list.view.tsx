import { Input } from "@workspace/ui/atoms/input"
import {
  DataTable,
  DataTablePagination,
  type DataTableColumn,
} from "@workspace/ui/molecules/data-table"
import { PageHeader } from "@workspace/ui/molecules/page-header"

import type { UserSummary } from "@/lib/api/types"
import type { useUsersListViewModel } from "@/viewmodels/users/use-users.viewmodel"

type UsersListViewProps = ReturnType<typeof useUsersListViewModel>

export function UsersListView({
  users,
  total,
  isLoading,
  page,
  setPage,
  search,
  setSearch,
  goToDetail,
}: UsersListViewProps) {
  const columns: DataTableColumn<UserSummary>[] = [
    {
      key: "name",
      header: "Nome",
      cell: (row) => (
        <button type="button" className="hover:underline" onClick={() => goToDetail(row)}>
          {row.name}
        </button>
      ),
    },
    { key: "email", header: "E-mail", cell: (row) => row.email },
    { key: "created", header: "Criado", cell: (row) => row.created_at },
  ]

  return (
    <>
      <PageHeader title="Utilizadores" description="Gerir contas e acessos." />
      <div className="mb-4">
        <Input
          placeholder="Pesquisar…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="sm:max-w-xs"
        />
      </div>
      <DataTable columns={columns} data={users} isLoading={isLoading} getRowKey={(r) => r.id} />
      <DataTablePagination page={page} perPage={15} total={total} onPageChange={setPage} />
    </>
  )
}
