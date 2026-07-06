import { useProjectsListViewModel } from "@/viewmodels/projects/use-projects-list.viewmodel"
import { ProjectsListView } from "@/views/projects/projects-list.view"

export function ProjectsListPage() {
  const viewModel = useProjectsListViewModel()
  return <ProjectsListView {...viewModel} />
}
