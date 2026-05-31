import { MathUtils } from "three"
import type { PerspectiveCamera } from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

import { syncLocomotionBaseFromCamera } from "@/lib/scene/camera-locomotion"
import { syncLookInputFromEuler } from "@/lib/scene/look-input"
import { getInitialLookAngles, SCENE_MODEL } from "@/models/scene/scene.model"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"

export function applyInitialSceneView(
  camera: PerspectiveCamera,
  controls?: OrbitControlsImpl | null
) {
  const { initialPosition, initialRotationDeg, fov } = SCENE_MODEL.camera
  const { initialTarget, initialOrbit } = SCENE_MODEL.controls
  const { yaw, pitch } = getInitialLookAngles()

  camera.position.set(...initialPosition)
  camera.rotation.set(
    MathUtils.degToRad(initialRotationDeg[0]),
    MathUtils.degToRad(initialRotationDeg[1]),
    MathUtils.degToRad(initialRotationDeg[2]),
    "YXZ"
  )
  camera.fov = fov
  camera.updateProjectionMatrix()

  syncLookInputFromEuler(yaw, pitch)
  useSceneControlsStore.getState().setLookAngles(yaw, pitch)

  if (controls) {
    controls.target.set(...initialTarget)
    controls.setAzimuthalAngle(MathUtils.degToRad(initialOrbit.azimuthDeg))
    controls.setPolarAngle(MathUtils.degToRad(initialOrbit.polarDeg))
    controls.update()
    camera.position.set(...initialPosition)
    camera.rotation.set(
      MathUtils.degToRad(initialRotationDeg[0]),
      MathUtils.degToRad(initialRotationDeg[1]),
      MathUtils.degToRad(initialRotationDeg[2]),
      "YXZ"
    )
  }

  syncLocomotionBaseFromCamera(camera)
}
