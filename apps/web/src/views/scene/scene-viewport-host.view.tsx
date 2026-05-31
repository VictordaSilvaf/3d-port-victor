import { useEffect, type ReactNode } from "react"

import { queueMouseDelta } from "@/lib/scene/look-input"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"

type SceneViewportHostViewProps = {
  children: ReactNode
}

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

export function SceneViewportHostView({ children }: SceneViewportHostViewProps) {
  const setViewportElement = useSceneControlsStore(
    (state) => state.setViewportElement
  )
  const setPointerLocked = useSceneControlsStore(
    (state) => state.setPointerLocked
  )
  const controlMode = useSceneControlsStore((state) => state.controlMode)
  const lookEnabled = useSceneControlsStore((state) => state.lookEnabled)
  const requestPointerLock = useSceneControlsStore(
    (state) => state.requestPointerLock
  )
  const toggleControlMode = useSceneControlsStore(
    (state) => state.toggleControlMode
  )
  const exitPointerLock = useSceneControlsStore((state) => state.exitPointerLock)

  useEffect(() => {
    const handlePointerLockChange = () => {
      const viewport = useSceneControlsStore.getState().viewportElement
      const locked = document.pointerLockElement === viewport
      setPointerLocked(locked)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const state = useSceneControlsStore.getState()
      if (document.pointerLockElement !== state.viewportElement) {
        return
      }

      if (state.controlMode !== "look" || !state.lookEnabled) {
        return
      }

      queueMouseDelta(-event.movementX, -event.movementY)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isTypingInFormField()) {
        return
      }

      if (event.key.toLowerCase() === "l") {
        const activeInViewport = document.activeElement?.closest(
          "[data-scene-viewport]"
        )
        if (!activeInViewport) {
          return
        }

        event.preventDefault()
        toggleControlMode()
      }

      if (event.key === "Escape") {
        exitPointerLock()
      }
    }

    document.addEventListener("pointerlockchange", handlePointerLockChange)
    document.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
      document.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("keydown", handleKeyDown)
      exitPointerLock()
    }
  }, [exitPointerLock, setPointerLocked, toggleControlMode])

  return (
    <div
      ref={setViewportElement}
      data-scene-viewport
      tabIndex={0}
      className="relative h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      onPointerDown={(event) => {
        event.currentTarget.focus()

        if (controlMode === "look" && lookEnabled) {
          requestPointerLock()
        }
      }}
      aria-label="Cenário 3D. Modo olhar: clique para capturar o mouse. L alterna modos."
    >
      {children}
    </div>
  )
}
