import { useUserDetailViewModel } from "@/viewmodels/users/use-users.viewmodel"
import { UserDetailView } from "@/views/users/user-detail.view"

export function UserDetailPage() {
  const viewModel = useUserDetailViewModel()
  return <UserDetailView {...viewModel} />
}
