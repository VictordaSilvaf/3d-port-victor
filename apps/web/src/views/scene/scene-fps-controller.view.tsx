import { useKeyboardControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useRef } from "react"
import { Euler, PerspectiveCamera } from "three"

import { applyInitialSceneView } from "@/lib/scene/apply-initial-scene-view"
import {
  syncLocomotionBaseFromCamera,
  updateFpsLocomotion,
} from "@/lib/scene/camera-locomotion"
import {
  getMovementInput,
  idleMovementInput,
  mergeMovementInput,
} from "@/lib/scene/movement-input"
import { getTouchMovementInput } from "@/lib/scene/touch-movement"
import { SCENE_MODEL } from "@/models/scene/scene.model"
import {
  applyMouseDelta,
  lookInput,
  syncLookInputFromEuler,
} from "@/lib/scene/look-input"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"

const euler = new Euler(0, 0, 0, "YXZ")

function isTypingInFormField() {
  const active = document.activeElement
  if (!(active instanceof HTMLElement)) {
    return false
  }

  if (active.isContentEditable) {
    return true
  }

  return Boolean(
    active.closest("input, textarea, select, [contenteditable='true']")
  )
}

export function SceneFpsControllerView() {
  const camera = useThree((state) => state.camera as PerspectiveCamera)
  const getKeys = useKeyboardControls()[1]

  const controlModeRef = useRef(useSceneControlsStore.getState().controlMode)
  const lookEnabledRef = useRef(useSceneControlsStore.getState().lookEnabled)
  const syncDebugFrame = useRef(0)
  const hasSyncedInitialLook = useRef(false)

  useLayoutEffect(() => {
    if (hasSyncedInitialLook.current) {
      return
    }

    applyInitialSceneView(camera)
    hasSyncedInitialLook.current = true
  }, [camera])

  useEffect(() => {
    return useSceneControlsStore.subscribe((state, previous) => {
      controlModeRef.current = state.controlMode
      lookEnabledRef.current = state.lookEnabled

      if (state.controlMode === "look" && previous.controlMode !== "look") {
        euler.setFromQuaternion(camera.quaternion, "YXZ")
        syncLookInputFromEuler(euler.y, euler.x)
        syncLocomotionBaseFromCamera(camera)
        useSceneControlsStore.getState().setLookAngles(euler.y, euler.x)
      }

      if (state.controlMode === "orbit" && previous.controlMode === "look") {
        syncLocomotionBaseFromCamera(camera)
      }
    })
  }, [camera])

  useFrame((_, delta) => {
    if (controlModeRef.current !== "look" || !lookEnabledRef.current) {
      return
    }

    const { lookSensitivity, isMobileLayout } = useSceneControlsStore.getState()
    const sensitivity = isMobileLayout
      ? SCENE_MODEL.look.touchSensitivity
      : lookSensitivity
    applyMouseDelta(sensitivity)

    const keys = isTypingInFormField()
      ? idleMovementInput
      : mergeMovementInput(
          getMovementInput(getKeys),
          getTouchMovementInput()
        )

    updateFpsLocomotion(camera, keys, lookInput.yaw, lookInput.pitch, delta)

    syncDebugFrame.current += 1
    if (syncDebugFrame.current % 6 === 0) {
      useSceneControlsStore.getState().setLookAngles(lookInput.yaw, lookInput.pitch)
    }
  }, -1)

  return null
}
