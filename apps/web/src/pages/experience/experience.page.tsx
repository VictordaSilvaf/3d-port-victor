import { useExperienceViewModel } from "@/viewmodels/experience/use-experience.viewmodel"
import { ExperienceView } from "@/views/experience/experience.view"
import { SceneDevToolsView } from "@/views/scene/scene-dev-tools.view"

export function ExperiencePage() {
  const viewModel = useExperienceViewModel()

  return (
    <>
      {import.meta.env.DEV ? <SceneDevToolsView /> : null}
      <ExperienceView {...viewModel} />
    </>
  )
}
