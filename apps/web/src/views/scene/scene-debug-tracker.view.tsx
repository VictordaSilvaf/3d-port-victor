import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { MathUtils, PerspectiveCamera, Vector3 } from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

import { useSceneDebugStore } from "@/stores/scene/scene-debug.store"
import { useSceneStore } from "@/stores/scene/scene.store"

const targetVector = new Vector3()

export function SceneDebugTrackerView() {
  const setSnapshot = useSceneDebugStore((state) => state.setSnapshot)
  const smoothedFps = useRef(60)

  const camera = useThree((state) => state.camera)
  const controls = useThree(
    (state) => state.controls as OrbitControlsImpl | undefined
  )

  useFrame((_, delta) => {
    const instantFps = delta > 0 ? 1 / delta : 0
    smoothedFps.current = MathUtils.lerp(smoothedFps.current, instantFps, 0.12)

    const orbitTarget = controls?.target ?? targetVector.set(0, 0, 0)
    const distance = camera.position.distanceTo(orbitTarget)

    const modelScale = useSceneStore.getState().modelScale
    const modelPosition = useSceneStore.getState().position

    const perspectiveCamera = camera as PerspectiveCamera

    setSnapshot({
      fps: smoothedFps.current,
      camera: {
        position: [
          camera.position.x,
          camera.position.y,
          camera.position.z,
        ],
        rotation: [
          MathUtils.radToDeg(camera.rotation.x),
          MathUtils.radToDeg(camera.rotation.y),
          MathUtils.radToDeg(camera.rotation.z),
        ],
        fov: perspectiveCamera.fov ?? 50,
      },
      orbit: {
        target: [orbitTarget.x, orbitTarget.y, orbitTarget.z],
        distance,
        azimuthDeg: controls
          ? MathUtils.radToDeg(controls.getAzimuthalAngle())
          : 0,
        polarDeg: controls ? MathUtils.radToDeg(controls.getPolarAngle()) : 0,
      },
      model: {
        scale: modelScale,
        position: [...modelPosition],
      },
    })
  })

  return null
}
