import { Leva } from "leva"

import { useSceneControlsViewModel } from "@/viewmodels/scene/use-scene-controls.viewmodel"

export function SceneDevToolsView() {
  useSceneControlsViewModel()

  return <Leva collapsed hidden={false} titleBar={{ title: "Portfólio 3D" }} />
}
