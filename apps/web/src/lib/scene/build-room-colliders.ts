import { Box3, Mesh, Object3D, Vector3 } from "three"

import { buildMeshComponentColliders } from "@/lib/scene/mesh-component-colliders"
import { colliderRegistry, setCollidersReady } from "@/lib/scene/collision"
import { SCENE_MODEL } from "@/models/scene/scene.model"

export function buildRoomColliders(room: Object3D) {
  const { collision } = SCENE_MODEL

  room.updateMatrixWorld(true)

  const fullBounds = new Box3().setFromObject(room)
  const roomBounds = fullBounds.clone()
  const roomSize = new Vector3()
  fullBounds.getSize(roomSize)
  const roomVolume = roomSize.x * roomSize.y * roomSize.z

  roomBounds.min.x += collision.wallInset
  roomBounds.max.x -= collision.wallInset
  roomBounds.min.z += collision.wallInset
  roomBounds.max.z -= collision.wallInset
  roomBounds.min.y += collision.floorInset
  roomBounds.max.y -= collision.ceilingInset

  const furnitureBoxes: { id: string; box: Box3 }[] = []

  room.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return
    }

    const components = buildMeshComponentColliders(
      child,
      child.matrixWorld,
      roomSize,
      roomVolume,
      collision
    )

    furnitureBoxes.push(...components)
  })

  colliderRegistry.roomBounds = roomBounds
  colliderRegistry.floorY = roomBounds.min.y
  colliderRegistry.ceilingY = roomBounds.max.y
  colliderRegistry.boxes = furnitureBoxes.map((entry) => ({
    id: entry.id,
    box: entry.box,
    kind: "furniture" as const,
  }))
  setCollidersReady(true)

  if (import.meta.env.DEV) {
    console.info(
      `[scene] ${furnitureBoxes.length} furniture colliders built from GLB components`
    )
  }

  return {
    roomBounds,
    furnitureCount: furnitureBoxes.length,
  }
}

export function getColliderBoxesForDebug() {
  const boxes = [...colliderRegistry.boxes]

  if (colliderRegistry.roomBounds) {
    boxes.unshift({
      id: "room-bounds",
      box: colliderRegistry.roomBounds,
      kind: "boundary",
    })
  }

  return boxes
}
