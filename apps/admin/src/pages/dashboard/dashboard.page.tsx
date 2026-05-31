import { useDashboardViewModel } from "@/viewmodels/dashboard/use-dashboard.viewmodel"
import { DashboardView } from "@/views/dashboard/dashboard.view"

export function DashboardPage() {
  const viewModel = useDashboardViewModel()

  return <DashboardView {...viewModel} />
}
