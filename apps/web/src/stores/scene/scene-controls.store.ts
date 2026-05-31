import { create } from "zustand"

import { isMobileLayout } from "@/lib/scene/device"
import { SCENE_MODEL } from "@/models/scene/scene.model"

export type SceneControlMode = "orbit" | "look"

type SceneControlsState = {
  controlMode: SceneControlMode
  isMobileLayout: boolean
  showCrosshair: boolean
  lookEnabled: boolean
  orbitEnabled: boolean
  pointerLocked: boolean
  lookSensitivity: number
  lookYaw: number
  lookPitch: number
  viewportElement: HTMLDivElement | null
  setControlMode: (mode: SceneControlMode) => void
  setIsMobileLayout: (isMobileLayout: boolean) => void
  setShowCrosshair: (show: boolean) => void
  setLookEnabled: (enabled: boolean) => void
  setOrbitEnabled: (enabled: boolean) => void
  setPointerLocked: (pointerLocked: boolean) => void
  setLookSensitivity: (sensitivity: number) => void
  setViewportElement: (element: HTMLDivElement | null) => void
  setLookAngles: (yaw: number, pitch: number) => void
  applyDeviceDefaults: () => void
  toggleControlMode: () => void
  toggleCrosshair: () => void
  requestPointerLock: () => void
  exitPointerLock: () => void
  togglePointerLock: () => void
}

const pitchLimit = Math.PI / 2 - 0.05

const initialMobileLayout = isMobileLayout()

export const useSceneControlsStore = create<SceneControlsState>((set, get) => ({
  controlMode: initialMobileLayout ? "look" : "orbit",
  isMobileLayout: initialMobileLayout,
  showCrosshair: true,
  lookEnabled: true,
  orbitEnabled: true,
  pointerLocked: false,
  lookSensitivity: SCENE_MODEL.look.sensitivity,
  lookYaw: 0,
  lookPitch: 0,
  viewportElement: null,
  setControlMode: (controlMode) => set({ controlMode }),
  setIsMobileLayout: (isMobileLayout) => set({ isMobileLayout }),
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
  applyDeviceDefaults: () => {
    const mobile = isMobileLayout()
    set({ isMobileLayout: mobile })

    if (mobile) {
      get().exitPointerLock()
      set({
        controlMode: "look",
        lookEnabled: true,
        showCrosshair: true,
      })
    }
  },
  toggleControlMode: () => {
    const nextMode = get().controlMode === "orbit" ? "look" : "orbit"
    set({ controlMode: nextMode })

    if (nextMode === "orbit") {
      get().exitPointerLock()
    }
  },
  toggleCrosshair: () => set((state) => ({ showCrosshair: !state.showCrosshair })),
  requestPointerLock: () => {
    const { viewportElement, controlMode, lookEnabled, isMobileLayout } = get()

    if (
      !viewportElement ||
      controlMode !== "look" ||
      !lookEnabled ||
      isMobileLayout
    ) {
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
