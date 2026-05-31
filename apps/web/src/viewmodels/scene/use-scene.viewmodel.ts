import { useSceneStore } from "@/stores/scene/scene.store"

export function useSceneViewModel() {
  const rotationSpeed = useSceneStore((state) => state.rotationSpeed)
  const distort = useSceneStore((state) => state.distort)
  const radius = useSceneStore((state) => state.radius)
  const color = useSceneStore((state) => state.color)
  const metalness = useSceneStore((state) => state.metalness)
  const roughness = useSceneStore((state) => state.roughness)
  const autoRotate = useSceneStore((state) => state.autoRotate)
  const showGrid = useSceneStore((state) => state.showGrid)
  const environmentPreset = useSceneStore((state) => state.environmentPreset)

  return {
    rotationSpeed,
    distort,
    radius,
    color,
    metalness,
    roughness,
    autoRotate,
    showGrid,
    environmentPreset,
  }
}

export type SceneViewModel = ReturnType<typeof useSceneViewModel>
