import { Leva } from "leva"

import { useSceneControlsViewModel } from "@/viewmodels/scene/use-scene-controls.viewmodel"
import { SceneDebugBarView } from "@/views/scene/scene-debug-bar.view"

export function SceneDevToolsView() {
  useSceneControlsViewModel()

  return (
    <>
      <SceneDebugBarView />
      <Leva collapsed hidden={false} titleBar={{ title: "Portfólio 3D" }} />
    </>
  )
}
