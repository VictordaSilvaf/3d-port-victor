import { usePagesListViewModel } from "@/viewmodels/pages/use-pages-list.viewmodel"
import { PagesListView } from "@/views/pages/pages-list.view"

export function PagesListPage() {
  const viewModel = usePagesListViewModel()
  return <PagesListView {...viewModel} />
}
