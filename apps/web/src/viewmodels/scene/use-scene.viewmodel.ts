import { useSceneStore } from "@/stores/scene/scene.store"

export function useSceneViewModel() {
  const modelScale = useSceneStore((state) => state.modelScale)
  const position = useSceneStore((state) => state.position)
  const rotationSpeed = useSceneStore((state) => state.rotationSpeed)
  const autoRotate = useSceneStore((state) => state.autoRotate)
  const useEnvironment = useSceneStore((state) => state.useEnvironment)
  const environmentPreset = useSceneStore((state) => state.environmentPreset)
  const ambientIntensity = useSceneStore((state) => state.ambientIntensity)
  const directionalIntensity = useSceneStore(
    (state) => state.directionalIntensity
  )

  return {
    modelScale,
    position,
    rotationSpeed,
    autoRotate,
    useEnvironment,
    environmentPreset,
    ambientIntensity,
    directionalIntensity,
  }
}

export type SceneViewModel = ReturnType<typeof useSceneViewModel>
