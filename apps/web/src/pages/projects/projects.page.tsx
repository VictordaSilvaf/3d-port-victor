import { useProjectsViewModel } from "@/viewmodels/projects/use-projects.viewmodel"
import { ProjectsView } from "@/views/projects/projects.view"

export function ProjectsPage() {
  return <ProjectsView {...useProjectsViewModel()} />
}
