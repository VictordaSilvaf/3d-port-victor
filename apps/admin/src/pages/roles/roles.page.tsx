import { useRolesViewModel } from "@/viewmodels/roles/use-roles.viewmodel"
import { RolesView } from "@/views/roles/roles.view"

export function RolesPage() {
  const viewModel = useRolesViewModel()
  return <RolesView {...viewModel} />
}
