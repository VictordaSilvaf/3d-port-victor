import { useProjectDetailViewModel } from "@/viewmodels/projects/use-project-detail.viewmodel"
import { ProjectDetailView } from "@/views/projects/project-detail.view"

export function ProjectDetailPage() {
  return <ProjectDetailView {...useProjectDetailViewModel()} />
}
