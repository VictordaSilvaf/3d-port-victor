import { create } from "zustand"

import { SCENE_MODEL } from "@/models/scene/scene.model"

export type SceneControlMode = "orbit" | "look"

type SceneControlsState = {
  controlMode: SceneControlMode
  showCrosshair: boolean
  lookEnabled: boolean
  orbitEnabled: boolean
  pointerLocked: boolean
  lookSensitivity: number
  lookYaw: number
  lookPitch: number
  viewportElement: HTMLDivElement | null
  setControlMode: (mode: SceneControlMode) => void
  setShowCrosshair: (show: boolean) => void
  setLookEnabled: (enabled: boolean) => void
  setOrbitEnabled: (enabled: boolean) => void
  setPointerLocked: (locked: boolean) => void
  setLookSensitivity: (sensitivity: number) => void
  setViewportElement: (element: HTMLDivElement | null) => void
  setLookAngles: (yaw: number, pitch: number) => void
  toggleControlMode: () => void
  toggleCrosshair: () => void
  requestPointerLock: () => void
  exitPointerLock: () => void
  togglePointerLock: () => void
}

const pitchLimit = Math.PI / 2 - 0.05

export const useSceneControlsStore = create<SceneControlsState>((set, get) => ({
  controlMode: "orbit",
  showCrosshair: true,
  lookEnabled: true,
  orbitEnabled: true,
  pointerLocked: false,
  lookSensitivity: SCENE_MODEL.look.sensitivity,
  lookYaw: 0,
  lookPitch: 0,
  viewportElement: null,
  setControlMode: (controlMode) => set({ controlMode }),
  setShowCrosshair: (showCrosshair) => set({ showCrosshair }),
  setLookEnabled: (lookEnabled) => set({ lookEnabled }),
  setOrbitEnabled: (orbitEnabled) => set({ orbitEnabled }),
  setPointerLocked: (pointerLocked) => set({ pointerLocked }),
  setLookSensitivity: (lookSensitivity) => set({ lookSensitivity }),
  setViewportElement: (viewportElement) => set({ viewportElement }),
  setLookAngles: (lookYaw, lookPitch) =>
    set({
      lookYaw,
      lookPitch: Math.max(-pitchLimit, Math.min(pitchLimit, lookPitch)),
    }),
  toggleControlMode: () => {
    const nextMode = get().controlMode === "orbit" ? "look" : "orbit"
    set({ controlMode: nextMode })

    if (nextMode === "orbit") {
      get().exitPointerLock()
    }
  },
  toggleCrosshair: () => set((state) => ({ showCrosshair: !state.showCrosshair })),
  requestPointerLock: () => {
    const { viewportElement, controlMode, lookEnabled } = get()
    if (!viewportElement || controlMode !== "look" || !lookEnabled) {
      return
    }

    void viewportElement.requestPointerLock()
  },
  exitPointerLock: () => {
    if (document.pointerLockElement) {
      void document.exitPointerLock()
    }
  },
  togglePointerLock: () => {
    if (document.pointerLockElement) {
      get().exitPointerLock()
      return
    }

    get().requestPointerLock()
  },
}))
