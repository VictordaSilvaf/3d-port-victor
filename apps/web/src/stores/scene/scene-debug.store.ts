import { create } from "zustand"

export type SceneDebugSnapshot = {
  fps: number
  camera: {
    position: [number, number, number]
    rotation: [number, number, number]
    fov: number
  }
  orbit: {
    target: [number, number, number]
    distance: number
    azimuthDeg: number
    polarDeg: number
  }
  model: {
    scale: number
    position: [number, number, number]
  }
}

const emptySnapshot: SceneDebugSnapshot = {
  fps: 0,
  camera: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    fov: 0,
  },
  orbit: {
    target: [0, 0, 0],
    distance: 0,
    azimuthDeg: 0,
    polarDeg: 0,
  },
  model: {
    scale: 0,
    position: [0, 0, 0],
  },
}

type SceneDebugState = {
  snapshot: SceneDebugSnapshot
  isPaused: boolean
  setSnapshot: (snapshot: SceneDebugSnapshot) => void
  setPaused: (isPaused: boolean) => void
  togglePaused: () => void
}

export const useSceneDebugStore = create<SceneDebugState>((set) => ({
  snapshot: emptySnapshot,
  isPaused: false,
  setSnapshot: (snapshot) =>
    set((state) => (state.isPaused ? state : { snapshot })),
  setPaused: (isPaused) => set({ isPaused }),
  togglePaused: () => set((state) => ({ isPaused: !state.isPaused })),
}))
