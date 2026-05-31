import { useCallback } from "react"

import { SCENE_MODEL } from "@/models/scene/scene.model"
import { useSceneDebugStore } from "@/stores/scene/scene-debug.store"
import { useSceneStore } from "@/stores/scene/scene.store"

const format = (value: number, digits = 2) => value.toFixed(digits)

const formatVec3 = (vec: readonly [number, number, number]) =>
  `[${format(vec[0])}, ${format(vec[1])}, ${format(vec[2])}]`

export function useSceneDebugViewModel() {
  const snapshot = useSceneDebugStore((state) => state.snapshot)
  const isPaused = useSceneDebugStore((state) => state.isPaused)
  const togglePaused = useSceneDebugStore((state) => state.togglePaused)

  const rows = [
    { label: "FPS", value: format(snapshot.fps, 0) },
    {
      label: "Camera pos",
      value: formatVec3(snapshot.camera.position),
    },
    {
      label: "Camera rot (°)",
      value: formatVec3(snapshot.camera.rotation),
    },
    { label: "Camera FOV", value: format(snapshot.camera.fov, 1) },
    {
      label: "Orbit target",
      value: formatVec3(snapshot.orbit.target),
    },
    {
      label: "Orbit distance",
      value: format(snapshot.orbit.distance),
    },
    {
      label: "Azimuth (°)",
      value: format(snapshot.orbit.azimuthDeg, 1),
    },
    {
      label: "Polar (°)",
      value: format(snapshot.orbit.polarDeg, 1),
    },
    {
      label: "Model scale",
      value: format(snapshot.model.scale),
    },
    {
      label: "Model pos",
      value: formatVec3(snapshot.model.position),
    },
  ]

  const buildConfigSnippet = useCallback(() => {
    const { camera, orbit, model } = snapshot

    return `// scene.model.ts — valores da câmera em tempo real
camera: {
  offset: [${format(camera.position[0] - model.position[0])}, ${format(camera.position[1] - model.position[1])}, ${format(camera.position[2] - model.position[2])}],
},
controls: {
  targetOffset: [${format(orbit.target[0] - model.position[0])}, ${format(orbit.target[1] - model.position[1])}, ${format(orbit.target[2] - model.position[2])}],
},
defaults: {
  modelScale: ${format(model.scale)},
  position: ${formatVec3(model.position)},
}`
  }, [snapshot])

  const copyText = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text)
  }, [])

  const copySnapshotJson = useCallback(async () => {
    await copyText(JSON.stringify(snapshot, null, 2))
  }, [copyText, snapshot])

  const copyConfigSnippet = useCallback(async () => {
    await copyText(buildConfigSnippet())
  }, [buildConfigSnippet, copyText])

  const resetScene = useCallback(() => {
    useSceneStore.getState().reset()
  }, [])

  return {
    rows,
    isPaused,
    togglePaused,
    copySnapshotJson,
    copyConfigSnippet,
    resetScene,
    cameraOffset: SCENE_MODEL.camera.offset,
    targetOffset: SCENE_MODEL.controls.targetOffset,
  }
}
