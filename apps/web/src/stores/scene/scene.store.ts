import { create } from "zustand"

import {
  SCENE_MODEL,
  type SceneDefaults,
  type SceneEnvironmentPreset,
} from "@/models/scene/scene.model"

type SceneState = SceneDefaults & {
  setRotationSpeed: (rotationSpeed: number) => void
  setDistort: (distort: number) => void
  setRadius: (radius: number) => void
  setColor: (color: string) => void
  setMetalness: (metalness: number) => void
  setRoughness: (roughness: number) => void
  setAutoRotate: (autoRotate: boolean) => void
  setShowGrid: (showGrid: boolean) => void
  setEnvironmentPreset: (environmentPreset: SceneEnvironmentPreset) => void
  reset: () => void
}

const initialState = SCENE_MODEL.defaults

export const useSceneStore = create<SceneState>((set) => ({
  ...initialState,
  setRotationSpeed: (rotationSpeed) => set({ rotationSpeed }),
  setDistort: (distort) => set({ distort }),
  setRadius: (radius) => set({ radius }),
  setColor: (color) => set({ color }),
  setMetalness: (metalness) => set({ metalness }),
  setRoughness: (roughness) => set({ roughness }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setEnvironmentPreset: (environmentPreset) => set({ environmentPreset }),
  reset: () => set(initialState),
}))
