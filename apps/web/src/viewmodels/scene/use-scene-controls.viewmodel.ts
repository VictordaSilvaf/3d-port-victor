import { useControls, button } from "leva"

import type { SceneEnvironmentPreset } from "@/models/scene/scene.model"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"
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

  const setModelScale = useSceneStore((state) => state.setModelScale)
  const setPosition = useSceneStore((state) => state.setPosition)
  const setRotationSpeed = useSceneStore((state) => state.setRotationSpeed)
  const setAutoRotate = useSceneStore((state) => state.setAutoRotate)
  const setUseEnvironment = useSceneStore((state) => state.setUseEnvironment)
  const setEnvironmentPreset = useSceneStore((state) => state.setEnvironmentPreset)
  const setAmbientIntensity = useSceneStore((state) => state.setAmbientIntensity)
  const setDirectionalIntensity = useSceneStore(
    (state) => state.setDirectionalIntensity
  )
  const reset = useSceneStore((state) => state.reset)

  const lookSensitivity = useSceneControlsStore((state) => state.lookSensitivity)
  const showCrosshair = useSceneControlsStore((state) => state.showCrosshair)
  const setLookSensitivity = useSceneControlsStore(
    (state) => state.setLookSensitivity
  )
  const setShowCrosshair = useSceneControlsStore((state) => state.setShowCrosshair)

  useControls(
    "Controles",
    {
      showCrosshair: { value: showCrosshair, onChange: setShowCrosshair },
      lookSensitivity: {
        value: lookSensitivity,
        min: 0.0005,
        max: 0.01,
        step: 0.0001,
        onChange: setLookSensitivity,
      },
    },
    { collapsed: true }
  )

  useControls(
    "Garagem 3D",
    {
      modelScale: {
        value: modelScale,
        min: 0.1,
        max: 3,
        step: 0.01,
        onChange: setModelScale,
      },
      positionX: {
        value: position[0],
        min: -5,
        max: 5,
        step: 0.01,
        onChange: (x) =>
          setPosition([x, useSceneStore.getState().position[1], useSceneStore.getState().position[2]]),
      },
      positionY: {
        value: position[1],
        min: -3,
        max: 3,
        step: 0.01,
        onChange: (y) =>
          setPosition([useSceneStore.getState().position[0], y, useSceneStore.getState().position[2]]),
      },
      positionZ: {
        value: position[2],
        min: -5,
        max: 5,
        step: 0.01,
        onChange: (z) =>
          setPosition([useSceneStore.getState().position[0], useSceneStore.getState().position[1], z]),
      },
      ambientIntensity: {
        value: ambientIntensity,
        min: 0,
        max: 2,
        step: 0.01,
        onChange: setAmbientIntensity,
      },
      directionalIntensity: {
        value: directionalIntensity,
        min: 0,
        max: 3,
        step: 0.01,
        onChange: setDirectionalIntensity,
      },
      autoRotate: { value: autoRotate, onChange: setAutoRotate },
      rotationSpeed: {
        value: rotationSpeed,
        min: 0,
        max: 2,
        step: 0.01,
        onChange: setRotationSpeed,
      },
      useEnvironment: { value: useEnvironment, onChange: setUseEnvironment },
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
