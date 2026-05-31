import { useDocsViewModel } from "@/viewmodels/docs/use-docs.viewmodel"
import { DocsView } from "@/views/docs/docs.view"

export function DocsPage() {
  const viewModel = useDocsViewModel()

  return <DocsView {...viewModel} />
}
