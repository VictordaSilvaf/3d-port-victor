import { useKeyboardControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

import { updateOrbitLocomotion } from "@/lib/scene/camera-locomotion"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"

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

/** Movimento WASD no modo órbita com aceleração suave */
export function SceneKeyboardMovementView() {
  const getKeys = useKeyboardControls()[1]
  const camera = useThree((state) => state.camera)
  const controls = useThree(
    (state) => state.controls as OrbitControlsImpl | undefined
  )

  const controlModeRef = useRef(useSceneControlsStore.getState().controlMode)
  const orbitEnabledRef = useRef(useSceneControlsStore.getState().orbitEnabled)

  useEffect(() => {
    return useSceneControlsStore.subscribe((state) => {
      controlModeRef.current = state.controlMode
      orbitEnabledRef.current = state.orbitEnabled
    })
  }, [])

  useFrame((_, delta) => {
    if (controlModeRef.current !== "orbit" || !orbitEnabledRef.current) {
      return
    }

    const keys = isTypingInFormField()
      ? { forward: false, backward: false, left: false, right: false }
      : getKeys()

    updateOrbitLocomotion(camera, keys, delta, (moveDelta) => {
      if (controls && moveDelta.lengthSq() > 0) {
        controls.target.add(moveDelta)
        controls.update()
      }
    })
  })
}
