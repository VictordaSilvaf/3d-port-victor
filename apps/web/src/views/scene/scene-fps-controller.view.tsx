import { useKeyboardControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Euler } from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

import {
  initLocomotionBase,
  syncLocomotionBaseFromCamera,
  updateFpsLocomotion,
} from "@/lib/scene/camera-locomotion"
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
  const camera = useThree((state) => state.camera)
  const controls = useThree(
    (state) => state.controls as OrbitControlsImpl | undefined
  )
  const getKeys = useKeyboardControls()[1]

  const controlModeRef = useRef(useSceneControlsStore.getState().controlMode)
  const lookEnabledRef = useRef(useSceneControlsStore.getState().lookEnabled)
  const syncDebugFrame = useRef(0)

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

      if (state.controlMode === "orbit" && previous.controlMode !== "look") {
        initLocomotionBase(camera.position)
      }
    })
  }, [camera])

  useFrame((_, delta) => {
    if (controlModeRef.current !== "look" || !lookEnabledRef.current) {
      return
    }

    if (controls) {
      controls.enabled = false
    }

    const { lookSensitivity } = useSceneControlsStore.getState()
    applyMouseDelta(lookSensitivity)

    const keys = isTypingInFormField()
      ? { forward: false, backward: false, left: false, right: false }
      : getKeys()

    updateFpsLocomotion(camera, keys, lookInput.yaw, lookInput.pitch, delta)

    syncDebugFrame.current += 1
    if (syncDebugFrame.current % 6 === 0) {
      useSceneControlsStore.getState().setLookAngles(lookInput.yaw, lookInput.pitch)
    }
  }, -1)
}
