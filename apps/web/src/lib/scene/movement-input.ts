import type { SceneMovementKey } from "@/models/scene/scene.model"

type MovementInput = Record<SceneMovementKey, boolean>

export function getMovementInput(
  getKeys: () => Record<string, boolean>
): MovementInput {
  const keys = getKeys()

  return {
    forward: Boolean(keys.forward),
    backward: Boolean(keys.backward),
    left: Boolean(keys.left),
    right: Boolean(keys.right),
  }
}

export const idleMovementInput: MovementInput = {
  forward: false,
  backward: false,
  left: false,
  right: false,
}

export function mergeMovementInput(...inputs: MovementInput[]): MovementInput {
  return inputs.reduce<MovementInput>(
    (merged, input) => ({
      forward: merged.forward || input.forward,
      backward: merged.backward || input.backward,
      left: merged.left || input.left,
      right: merged.right || input.right,
    }),
    idleMovementInput
  )
}
