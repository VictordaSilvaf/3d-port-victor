import { useRef } from "react"

import { queueMouseDelta } from "@/lib/scene/look-input"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"

export function SceneTouchLookZoneView() {
  const isMobileLayout = useSceneControlsStore((state) => state.isMobileLayout)
  const controlMode = useSceneControlsStore((state) => state.controlMode)
  const activePointerId = useRef<number | null>(null)
  const lastPosition = useRef({ x: 0, y: 0 })

  if (!isMobileLayout || controlMode !== "look") {
    return null
  }

  const handlePointerEnd = (pointerId: number) => {
    if (pointerId !== activePointerId.current) {
      return
    }

    activePointerId.current = null
  }

  return (
    <div
      className="absolute inset-0 z-20 touch-none select-none"
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) {
          return
        }

        if (activePointerId.current !== null) {
          return
        }

        event.preventDefault()
        activePointerId.current = event.pointerId
        lastPosition.current = { x: event.clientX, y: event.clientY }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (event.pointerId !== activePointerId.current) {
          return
        }

        const deltaX = event.clientX - lastPosition.current.x
        const deltaY = event.clientY - lastPosition.current.y
        lastPosition.current = { x: event.clientX, y: event.clientY }

        if (deltaX === 0 && deltaY === 0) {
          return
        }

        queueMouseDelta(-deltaX, -deltaY)
      }}
      onPointerUp={(event) => {
        handlePointerEnd(event.pointerId)
        event.currentTarget.releasePointerCapture(event.pointerId)
      }}
      onPointerCancel={(event) => {
        handlePointerEnd(event.pointerId)
      }}
      aria-hidden
    />
  )
}
