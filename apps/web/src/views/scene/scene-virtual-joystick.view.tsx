import { useRef, useState } from "react"

import { SCENE_MODEL } from "@/models/scene/scene.model"
import {
  resetTouchMovementAxes,
  setTouchMovementAxes,
} from "@/lib/scene/touch-movement"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"

const BASE_SIZE = 112
const KNOB_SIZE = 48

export function SceneVirtualJoystickView() {
  const isMobileLayout = useSceneControlsStore((state) => state.isMobileLayout)
  const controlMode = useSceneControlsStore((state) => state.controlMode)
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 })
  const activePointerId = useRef<number | null>(null)
  const baseCenter = useRef({ x: 0, y: 0 })

  if (!isMobileLayout || controlMode !== "look") {
    return null
  }

  const maxRadius = SCENE_MODEL.touch.joystickRadius

  const updateKnob = (clientX: number, clientY: number) => {
    const dx = clientX - baseCenter.current.x
    const dy = clientY - baseCenter.current.y
    const distance = Math.hypot(dx, dy)
    const clampedDistance = Math.min(distance, maxRadius)
    const angle = Math.atan2(dy, dx)
    const clampedX = Math.cos(angle) * clampedDistance
    const clampedY = Math.sin(angle) * clampedDistance

    setKnobOffset({ x: clampedX, y: clampedY })

    const normalizedX = clampedX / maxRadius
    const normalizedY = clampedY / maxRadius
    setTouchMovementAxes(normalizedX, normalizedY)
  }

  const resetKnob = () => {
    activePointerId.current = null
    setKnobOffset({ x: 0, y: 0 })
    resetTouchMovementAxes()
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 flex items-end justify-center pb-[max(1rem,env(safe-area-inset-bottom))]"
      aria-hidden
    >
      <div
        className="pointer-events-auto relative touch-none select-none"
        style={{ width: BASE_SIZE, height: BASE_SIZE }}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) {
            return
          }

          event.preventDefault()
          event.stopPropagation()

          const rect = event.currentTarget.getBoundingClientRect()
          baseCenter.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          }
          activePointerId.current = event.pointerId
          event.currentTarget.setPointerCapture(event.pointerId)
          updateKnob(event.clientX, event.clientY)
        }}
        onPointerMove={(event) => {
          if (event.pointerId !== activePointerId.current) {
            return
          }

          event.preventDefault()
          updateKnob(event.clientX, event.clientY)
        }}
        onPointerUp={(event) => {
          if (event.pointerId !== activePointerId.current) {
            return
          }

          event.preventDefault()
          resetKnob()
        }}
        onPointerCancel={resetKnob}
      >
        <div className="border-border/70 bg-background/35 absolute inset-0 rounded-full border-2 shadow-inner backdrop-blur-sm" />
        <div
          className="border-primary/40 bg-primary/25 absolute rounded-full border shadow-md backdrop-blur-md"
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${knobOffset.x}px), calc(-50% + ${knobOffset.y}px))`,
          }}
        />
      </div>
    </div>
  )
}
