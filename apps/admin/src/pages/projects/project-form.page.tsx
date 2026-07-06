import { useProjectFormViewModel } from "@/viewmodels/projects/use-project-form.viewmodel"
import { ProjectFormView } from "@/views/projects/project-form.view"

export function ProjectFormPage() {
  const viewModel = useProjectFormViewModel()
  return <ProjectFormView {...viewModel} />
}
