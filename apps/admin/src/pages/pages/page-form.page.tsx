import { usePageFormViewModel } from "@/viewmodels/pages/use-page-form.viewmodel"
import { PageFormView } from "@/views/pages/page-form.view"

export function PageFormPage() {
  const viewModel = usePageFormViewModel()
  return <PageFormView {...viewModel} />
}
