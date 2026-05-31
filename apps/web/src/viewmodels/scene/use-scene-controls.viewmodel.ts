import { useControls, button } from "leva"

import type { SceneEnvironmentPreset } from "@/models/scene/scene.model"
import { useSceneStore } from "@/stores/scene/scene.store"

const ENVIRONMENT_PRESETS: SceneEnvironmentPreset[] = [
  "city",
  "sunset",
  "dawn",
  "night",
  "warehouse",
  "forest",
  "apartment",
  "studio",
  "park",
  "lobby",
]

export function useSceneControlsViewModel() {
  const rotationSpeed = useSceneStore((state) => state.rotationSpeed)
  const distort = useSceneStore((state) => state.distort)
  const radius = useSceneStore((state) => state.radius)
  const color = useSceneStore((state) => state.color)
  const metalness = useSceneStore((state) => state.metalness)
  const roughness = useSceneStore((state) => state.roughness)
  const autoRotate = useSceneStore((state) => state.autoRotate)
  const showGrid = useSceneStore((state) => state.showGrid)
  const environmentPreset = useSceneStore((state) => state.environmentPreset)

  const setRotationSpeed = useSceneStore((state) => state.setRotationSpeed)
  const setDistort = useSceneStore((state) => state.setDistort)
  const setRadius = useSceneStore((state) => state.setRadius)
  const setColor = useSceneStore((state) => state.setColor)
  const setMetalness = useSceneStore((state) => state.setMetalness)
  const setRoughness = useSceneStore((state) => state.setRoughness)
  const setAutoRotate = useSceneStore((state) => state.setAutoRotate)
  const setShowGrid = useSceneStore((state) => state.setShowGrid)
  const setEnvironmentPreset = useSceneStore((state) => state.setEnvironmentPreset)
  const reset = useSceneStore((state) => state.reset)

  useControls(
    "Cena 3D",
    {
      rotationSpeed: {
        value: rotationSpeed,
        min: 0,
        max: 2,
        step: 0.01,
        onChange: setRotationSpeed,
      },
      distort: {
        value: distort,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: setDistort,
      },
      radius: {
        value: radius,
        min: 0.5,
        max: 2,
        step: 0.01,
        onChange: setRadius,
      },
      color: { value: color, onChange: setColor },
      metalness: {
        value: metalness,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: setMetalness,
      },
      roughness: {
        value: roughness,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: setRoughness,
      },
      autoRotate: { value: autoRotate, onChange: setAutoRotate },
      showGrid: { value: showGrid, onChange: setShowGrid },
      environmentPreset: {
        value: environmentPreset,
        options: ENVIRONMENT_PRESETS,
        onChange: setEnvironmentPreset,
      },
      reset: button(() => reset()),
    },
    { collapsed: false }
  )
}
