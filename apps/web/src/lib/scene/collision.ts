import { Box3, Vector3 } from "three"

import { SCENE_MODEL } from "@/models/scene/scene.model"

export type SceneColliderBox = {
  id: string
  box: Box3
  kind: "boundary" | "furniture" | "floor"
}

const tempCenter = new Vector3()
const tempClosest = new Vector3()
const testCenter = new Vector3()

type ColliderReadyListener = () => void

const readyListeners = new Set<ColliderReadyListener>()

export const colliderRegistry = {
  boxes: [] as SceneColliderBox[],
  roomBounds: null as Box3 | null,
  floorY: 0,
  ceilingY: Number.POSITIVE_INFINITY,
  ready: false,
}

export function onCollidersReady(listener: ColliderReadyListener) {
  if (colliderRegistry.ready) {
    listener()
  }

  readyListeners.add(listener)
  return () => {
    readyListeners.delete(listener)
  }
}

function notifyCollidersReady() {
  for (const listener of readyListeners) {
    listener()
  }
}

export function setCollidersReady(ready: boolean) {
  colliderRegistry.ready = ready

  if (ready) {
    notifyCollidersReady()
  }
}

export function clearRoomColliders() {
  colliderRegistry.boxes = []
  colliderRegistry.roomBounds = null
  colliderRegistry.floorY = 0
  colliderRegistry.ceilingY = Number.POSITIVE_INFINITY
  setCollidersReady(false)
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function getBodyCenter(position: Vector3, target: Vector3) {
  const { bodyHeightOffset } = SCENE_MODEL.collision
  return target.set(
    position.x,
    position.y - bodyHeightOffset,
    position.z
  )
}

function closestPointOnBox(box: Box3, point: Vector3, target: Vector3) {
  return target.set(
    clamp(point.x, box.min.x, box.max.x),
    clamp(point.y, box.min.y, box.max.y),
    clamp(point.z, box.min.z, box.max.z)
  )
}

function sphereIntersectsBox(center: Vector3, radius: number, box: Box3) {
  closestPointOnBox(box, center, tempClosest)
  return tempClosest.distanceToSquared(center) < radius * radius
}

function pushSphereOutOfBox(center: Vector3, radius: number, box: Box3) {
  closestPointOnBox(box, center, tempClosest)

  const dx = center.x - tempClosest.x
  const dy = center.y - tempClosest.y
  const dz = center.z - tempClosest.z
  const distSq = dx * dx + dy * dy + dz * dz

  if (distSq > radius * radius) {
    return
  }

  if (distSq > 0.000001) {
    const dist = Math.sqrt(distSq)
    const push = (radius - dist) / dist
    center.x += dx * push
    center.y += dy * push
    center.z += dz * push
    return
  }

  const penX = Math.min(center.x - box.min.x, box.max.x - center.x)
  const penY = Math.min(center.y - box.min.y, box.max.y - center.y)
  const penZ = Math.min(center.z - box.min.z, box.max.z - center.z)

  if (penX <= penY && penX <= penZ) {
    center.x += center.x - box.min.x < box.max.x - center.x ? -radius : radius
    return
  }

  if (penY <= penZ) {
    center.y += center.y - box.min.y < box.max.y - center.y ? -radius : radius
    return
  }

  center.z += center.z - box.min.z < box.max.z - center.z ? -radius : radius
}

function clampToRoomBounds(center: Vector3, radius: number) {
  const bounds = colliderRegistry.roomBounds
  if (!bounds) {
    return
  }

  center.x = clamp(center.x, bounds.min.x + radius, bounds.max.x - radius)
  center.y = clamp(center.y, bounds.min.y + radius, bounds.max.y - radius)
  center.z = clamp(center.z, bounds.min.z + radius, bounds.max.z - radius)
}

function resolveBodyCenter(center: Vector3) {
  const { radius } = SCENE_MODEL.collision

  clampToRoomBounds(center, radius)

  for (const collider of colliderRegistry.boxes) {
    if (collider.kind === "boundary") {
      continue
    }

    pushSphereOutOfBox(center, radius, collider.box)
    clampToRoomBounds(center, radius)
  }
}

function applyBodyCenterToPosition(position: Vector3, center: Vector3) {
  const { bodyHeightOffset } = SCENE_MODEL.collision
  position.x = center.x
  position.z = center.z
  position.y = center.y + bodyHeightOffset
}

function clampVertical(position: Vector3) {
  const { bodyHeightOffset } = SCENE_MODEL.collision
  const minEyeY = colliderRegistry.floorY + bodyHeightOffset
  const maxEyeY = colliderRegistry.ceilingY - 0.15

  position.y = clamp(position.y, minEyeY, maxEyeY)
}

export function resolvePositionCollisions(position: Vector3) {
  if (!colliderRegistry.ready) {
    return
  }

  clampVertical(position)
  getBodyCenter(position, tempCenter)
  resolveBodyCenter(tempCenter)
  applyBodyCenterToPosition(position, tempCenter)
}

export function moveWithCollisions(position: Vector3, delta: Vector3) {
  if (!colliderRegistry.ready) {
    position.add(delta)
    return
  }

  if (delta.lengthSq() === 0) {
    resolvePositionCollisions(position)
    return
  }

  getBodyCenter(position, tempCenter)

  testCenter.copy(tempCenter)
  testCenter.x += delta.x
  if (!sphereWouldCollide(testCenter)) {
    tempCenter.x += delta.x
  }

  testCenter.copy(tempCenter)
  testCenter.z += delta.z
  if (!sphereWouldCollide(testCenter)) {
    tempCenter.z += delta.z
  }

  resolveBodyCenter(tempCenter)
  applyBodyCenterToPosition(position, tempCenter)
  clampVertical(position)
}

function sphereWouldCollide(center: Vector3) {
  return sphereIntersectsAny(center, SCENE_MODEL.collision.radius)
}

function sphereIntersectsAny(center: Vector3, radius: number) {
  if (
    colliderRegistry.roomBounds &&
    !isInsideRoomBounds(center, radius, colliderRegistry.roomBounds)
  ) {
    return true
  }

  for (const collider of colliderRegistry.boxes) {
    if (collider.kind === "boundary") {
      continue
    }

    if (sphereIntersectsBox(center, radius, collider.box)) {
      return true
    }
  }

  return false
}

function isInsideRoomBounds(center: Vector3, radius: number, bounds: Box3) {
  return (
    center.x - radius >= bounds.min.x &&
    center.x + radius <= bounds.max.x &&
    center.y - radius >= bounds.min.y &&
    center.y + radius <= bounds.max.y &&
    center.z - radius >= bounds.min.z &&
    center.z + radius <= bounds.max.z
  )
}
