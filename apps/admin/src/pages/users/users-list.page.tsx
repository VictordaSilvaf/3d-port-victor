import { useUsersListViewModel } from "@/viewmodels/users/use-users.viewmodel"
import { UsersListView } from "@/views/users/users-list.view"

export function UsersListPage() {
  const viewModel = useUsersListViewModel()
  return <UsersListView {...viewModel} />
}
