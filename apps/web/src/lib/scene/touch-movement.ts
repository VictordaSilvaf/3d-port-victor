import type { SceneMovementKey } from "@/models/scene/scene.model"

export type TouchMovementAxes = {
  x: number
  y: number
}

export const touchMovementAxes: TouchMovementAxes = {
  x: 0,
  y: 0,
}

const AXIS_THRESHOLD = 0.22

export function setTouchMovementAxes(x: number, y: number) {
  touchMovementAxes.x = x
  touchMovementAxes.y = y
}

export function resetTouchMovementAxes() {
  touchMovementAxes.x = 0
  touchMovementAxes.y = 0
}

export function getTouchMovementInput() {
  return {
    forward: touchMovementAxes.y < -AXIS_THRESHOLD,
    backward: touchMovementAxes.y > AXIS_THRESHOLD,
    left: touchMovementAxes.x < -AXIS_THRESHOLD,
    right: touchMovementAxes.x > AXIS_THRESHOLD,
  } satisfies Record<SceneMovementKey, boolean>
}
