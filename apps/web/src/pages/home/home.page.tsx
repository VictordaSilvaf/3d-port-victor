import { useHomeViewModel } from "@/viewmodels/home/use-home.viewmodel"
import { HomeView } from "@/views/home/home.view"
import { SceneDevToolsView } from "@/views/scene/scene-dev-tools.view"

export function HomePage() {
  const viewModel = useHomeViewModel()

  return (
    <>
      {import.meta.env.DEV ? <SceneDevToolsView /> : null}
      <HomeView {...viewModel} />
    </>
  )
}
