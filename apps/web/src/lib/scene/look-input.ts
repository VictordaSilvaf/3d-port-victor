const PITCH_LIMIT = Math.PI / 2 - 0.05

/** Estado de olhar fora do React — evita re-render a cada movimento do mouse */
export const lookInput = {
  yaw: 0,
  pitch: 0,
  mouseDeltaX: 0,
  mouseDeltaY: 0,
}

export function resetLookInput() {
  lookInput.yaw = 0
  lookInput.pitch = 0
  lookInput.mouseDeltaX = 0
  lookInput.mouseDeltaY = 0
}

export function queueMouseDelta(deltaX: number, deltaY: number) {
  lookInput.mouseDeltaX += deltaX
  lookInput.mouseDeltaY += deltaY
}

export function applyMouseDelta(sensitivity: number) {
  if (lookInput.mouseDeltaX === 0 && lookInput.mouseDeltaY === 0) {
    return false
  }

  lookInput.yaw += lookInput.mouseDeltaX * sensitivity
  lookInput.pitch = Math.max(
    -PITCH_LIMIT,
    Math.min(PITCH_LIMIT, lookInput.pitch + lookInput.mouseDeltaY * sensitivity)
  )

  lookInput.mouseDeltaX = 0
  lookInput.mouseDeltaY = 0

  return true
}

export function syncLookInputFromEuler(yaw: number, pitch: number) {
  lookInput.yaw = yaw
  lookInput.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch))
}
