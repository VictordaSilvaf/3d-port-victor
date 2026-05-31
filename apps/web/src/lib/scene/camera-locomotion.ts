import { MathUtils, Vector3 } from "three"
import type { PerspectiveCamera } from "three"

import { moveWithCollisions } from "@/lib/scene/collision"
import { SCENE_MODEL } from "@/models/scene/scene.model"

const { locomotion } = SCENE_MODEL

const worldUp = new Vector3(0, 1, 0)
const forward = new Vector3()
const sideways = new Vector3()
const targetVelocity = new Vector3()
const bobOffset = new Vector3()

export const locomotionState = {
  basePosition: new Vector3(),
  velocity: new Vector3(),
  bobPhase: 0,
  idlePhase: 0,
  initialized: false,
}

export function initLocomotionBase(position: Vector3) {
  locomotionState.basePosition.copy(position)
  locomotionState.velocity.set(0, 0, 0)
  locomotionState.bobPhase = 0
  locomotionState.idlePhase = 0
  locomotionState.initialized = true
}

function expSmoothing(lambda: number, delta: number) {
  return 1 - Math.exp(-lambda * delta)
}

export function updateFpsLocomotion(
  camera: PerspectiveCamera,
  input: { forward: boolean; backward: boolean; left: boolean; right: boolean },
  lookYaw: number,
  lookPitch: number,
  delta: number
) {
  if (!locomotionState.initialized) {
    initLocomotionBase(camera.position)
  }

  targetVelocity.set(0, 0, 0)

  if (input.forward || input.backward || input.left || input.right) {
    forward.set(-Math.sin(lookYaw), 0, -Math.cos(lookYaw))
    sideways.set(Math.cos(lookYaw), 0, -Math.sin(lookYaw))

    if (input.forward) targetVelocity.add(forward)
    if (input.backward) targetVelocity.sub(forward)
    if (input.right) targetVelocity.add(sideways)
    if (input.left) targetVelocity.sub(sideways)

    if (targetVelocity.lengthSq() > 0) {
      targetVelocity
        .normalize()
        .multiplyScalar(locomotion.maxSpeed)
    }
  }

  const isMoving = targetVelocity.lengthSq() > 0.0001
  const smoothFactor = expSmoothing(
    isMoving ? locomotion.acceleration : locomotion.deceleration,
    delta
  )

  locomotionState.velocity.lerp(targetVelocity, smoothFactor)

  if (!isMoving && locomotionState.velocity.lengthSq() < 0.0004) {
    locomotionState.velocity.set(0, 0, 0)
  }

  moveWithCollisions(
    locomotionState.basePosition,
    locomotionState.velocity.clone().multiplyScalar(delta)
  )

  const speed = locomotionState.velocity.length()
  const speedRatio = Math.min(speed / locomotion.maxSpeed, 1)

  let bobY = 0
  let bobX = 0
  let bobRoll = 0

  if (speedRatio > 0.05) {
    locomotionState.bobPhase += delta * locomotion.bob.frequency * speedRatio

    const stepWave = Math.sin(locomotionState.bobPhase * Math.PI * 2)
    const swayWave = Math.sin(locomotionState.bobPhase * Math.PI)

    bobY = stepWave * locomotion.bob.verticalAmp * speedRatio
    bobX = swayWave * locomotion.bob.horizontalAmp * speedRatio
    bobRoll = swayWave * locomotion.bob.rollAmp * speedRatio
  } else {
    locomotionState.bobPhase = MathUtils.lerp(
      locomotionState.bobPhase,
      0,
      smoothFactor
    )

    locomotionState.idlePhase += delta * locomotion.idleBreath.frequency
    bobY =
      Math.sin(locomotionState.idlePhase * Math.PI * 2) *
      locomotion.idleBreath.verticalAmp
  }

  camera.rotation.order = "YXZ"
  camera.rotation.y = lookYaw
  camera.rotation.x = lookPitch
  camera.rotation.z = bobRoll

  bobOffset.set(bobX, bobY, 0)
  bobOffset.applyQuaternion(camera.quaternion)

  camera.position.copy(locomotionState.basePosition).add(bobOffset)
}

export function updateOrbitLocomotion(
  camera: PerspectiveCamera,
  input: { forward: boolean; backward: boolean; left: boolean; right: boolean },
  delta: number,
  onMoved?: (delta: Vector3) => void
) {
  if (!locomotionState.initialized) {
    initLocomotionBase(camera.position)
  }

  targetVelocity.set(0, 0, 0)

  if (input.forward || input.backward || input.left || input.right) {
    camera.getWorldDirection(forward)
    forward.y = 0

    if (forward.lengthSq() > 0) {
      forward.normalize()
      sideways.crossVectors(forward, worldUp).normalize()

      if (input.forward) targetVelocity.add(forward)
      if (input.backward) targetVelocity.sub(forward)
      if (input.right) targetVelocity.add(sideways)
      if (input.left) targetVelocity.sub(sideways)

      if (targetVelocity.lengthSq() > 0) {
        targetVelocity
          .normalize()
          .multiplyScalar(locomotion.maxSpeed * 0.85)
      }
    }
  }

  const isMoving = targetVelocity.lengthSq() > 0.0001
  const smoothFactor = expSmoothing(
    isMoving ? locomotion.acceleration : locomotion.deceleration,
    delta
  )

  const previousPosition = locomotionState.basePosition.clone()
  locomotionState.velocity.lerp(targetVelocity, smoothFactor)

  if (!isMoving && locomotionState.velocity.lengthSq() < 0.0004) {
    locomotionState.velocity.set(0, 0, 0)
  }

  moveWithCollisions(
    locomotionState.basePosition,
    locomotionState.velocity.clone().multiplyScalar(delta)
  )

  const moveDelta = locomotionState.basePosition.clone().sub(previousPosition)
  camera.position.copy(locomotionState.basePosition)

  if (onMoved && moveDelta.lengthSq() > 0) {
    onMoved(moveDelta)
  }
}

export function syncLocomotionBaseFromCamera(camera: PerspectiveCamera) {
  locomotionState.basePosition.copy(camera.position)
  locomotionState.velocity.set(0, 0, 0)
  locomotionState.initialized = true
}
