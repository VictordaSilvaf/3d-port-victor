import { HOME_MODEL } from "@/models/home/home.model"
import { useSceneViewModel } from "@/viewmodels/scene/use-scene.viewmodel"

export function useHomeViewModel() {
  const scene = useSceneViewModel()

  return {
    content: HOME_MODEL,
    scene,
  }
}

export type HomeViewModel = ReturnType<typeof useHomeViewModel>
