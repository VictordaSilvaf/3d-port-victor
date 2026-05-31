import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react"
import { MOUSE, type PerspectiveCamera as PerspectiveCameraImpl } from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

import { applyInitialSceneView } from "@/lib/scene/apply-initial-scene-view"
import { syncLocomotionBaseFromCamera } from "@/lib/scene/camera-locomotion"
import { getInitialCameraRig, SCENE_MODEL } from "@/models/scene/scene.model"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"
import type { SceneViewModel } from "@/viewmodels/scene/use-scene.viewmodel"

import { SceneRoomView } from "./scene-room.view"

type SceneExperienceViewProps = SceneViewModel

const initialCameraRig = getInitialCameraRig()

export function SceneExperienceView({
  modelScale,
  position,
  rotationSpeed,
  autoRotate,
  useEnvironment,
  environmentPreset,
  ambientIntensity,
  directionalIntensity,
}: SceneExperienceViewProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const hasAppliedInitialView = useRef(false)
  const camera = useThree((state) => state.camera as PerspectiveCameraImpl)
  const gl = useThree((state) => state.gl)
  const controlMode = useSceneControlsStore((state) => state.controlMode)
  const orbitEnabled = useSceneControlsStore((state) => state.orbitEnabled)

  useLayoutEffect(() => {
    const controls = controlsRef.current
    if (!controls || hasAppliedInitialView.current) {
      return
    }

    applyInitialSceneView(camera, controls)
    hasAppliedInitialView.current = true
  }, [camera])

  useLayoutEffect(() => {
    const controls = controlsRef.current
    if (!controls) {
      return
    }

    controls.enabled = controlMode === "orbit" && orbitEnabled
  }, [controlMode, orbitEnabled])

  const handleOrbitEnd = () => {
    syncLocomotionBaseFromCamera(camera)
  }

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={initialCameraRig.position}
        rotation={initialCameraRig.rotation}
        fov={SCENE_MODEL.camera.fov}
        near={SCENE_MODEL.camera.near}
        far={SCENE_MODEL.camera.far}
      />

      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[...SCENE_MODEL.lights.directionalPosition]}
        intensity={directionalIntensity}
        castShadow
      />

      {useEnvironment ? <Environment preset={environmentPreset} /> : null}

      <SceneRoomView modelScale={modelScale} position={position} />

      <ContactShadows
        opacity={0.35}
        scale={20}
        blur={2.5}
        far={6}
        position={[0, 0, 0]}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        domElement={gl.domElement}
        target={[...SCENE_MODEL.controls.initialTarget]}
        enabled={controlMode === "orbit" && orbitEnabled}
        enableDamping
        dampingFactor={0.05}
        enableRotate
        enablePan
        enableZoom
        mouseButtons={{
          LEFT: MOUSE.ROTATE,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.PAN,
        }}
        minDistance={SCENE_MODEL.controls.minDistance}
        maxDistance={SCENE_MODEL.controls.maxDistance}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate={autoRotate && controlMode === "orbit"}
        autoRotateSpeed={rotationSpeed * 2}
        onEnd={handleOrbitEnd}
      />
    </>
  )
}
