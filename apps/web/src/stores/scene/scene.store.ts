import { create } from "zustand"

import {
  SCENE_MODEL,
  type SceneDefaults,
  type SceneEnvironmentPreset,
} from "@/models/scene/scene.model"

type SceneState = SceneDefaults & {
  setModelScale: (modelScale: number) => void
  setPosition: (position: readonly [number, number, number]) => void
  setRotationSpeed: (rotationSpeed: number) => void
  setAutoRotate: (autoRotate: boolean) => void
  setUseEnvironment: (useEnvironment: boolean) => void
  setEnvironmentPreset: (environmentPreset: SceneEnvironmentPreset) => void
  setAmbientIntensity: (ambientIntensity: number) => void
  setDirectionalIntensity: (directionalIntensity: number) => void
  reset: () => void
}

const initialState = SCENE_MODEL.defaults

export const useSceneStore = create<SceneState>((set) => ({
  ...initialState,
  setModelScale: (modelScale) => set({ modelScale }),
  setPosition: (position) => set({ position }),
  setRotationSpeed: (rotationSpeed) => set({ rotationSpeed }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setUseEnvironment: (useEnvironment) => set({ useEnvironment }),
  setEnvironmentPreset: (environmentPreset) => set({ environmentPreset }),
  setAmbientIntensity: (ambientIntensity) => set({ ambientIntensity }),
  setDirectionalIntensity: (directionalIntensity) =>
    set({ directionalIntensity }),
  reset: () => set(initialState),
}))
