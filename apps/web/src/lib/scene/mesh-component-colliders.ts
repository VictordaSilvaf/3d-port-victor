import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Matrix4,
  Mesh,
  Vector3,
} from "three"

import type { SCENE_MODEL } from "@/models/scene/scene.model"

type CollisionConfig = (typeof SCENE_MODEL)["collision"]

export type MeshComponentCollider = {
  id: string
  box: Box3
}

const tempPoint = new Vector3()
const tempSize = new Vector3()

const EXCLUDED_MESH_NAME_PARTS = [
  "outline",
  "wall",
  "floor",
  "ceiling",
  "background",
  "window",
  "glass",
] as const

const FURNITURE_MESH_NAME_PARTS = [
  "wood",
  "interior",
  "cable",
  "camera",
  "object_",
] as const

type GridCell = {
  min: Vector3
  max: Vector3
  triangleCount: number
}

function shouldSkipMesh(meshName: string) {
  const normalized = meshName.toLowerCase()

  return EXCLUDED_MESH_NAME_PARTS.some((part) => normalized.includes(part))
}

function isFurnitureMesh(meshName: string) {
  const normalized = meshName.toLowerCase()

  return FURNITURE_MESH_NAME_PARTS.some((part) => normalized.includes(part))
}

function forEachTriangle(
  geometry: BufferGeometry,
  callback: (a: number, b: number, c: number) => void
) {
  const position = geometry.getAttribute("position") as BufferAttribute
  const index = geometry.getIndex()

  if (index) {
    for (let triangle = 0; triangle < index.count; triangle += 3) {
      callback(
        index.getX(triangle),
        index.getX(triangle + 1),
        index.getX(triangle + 2)
      )
    }
    return
  }

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    callback(vertex, vertex + 1, vertex + 2)
  }
}

function getGridKey(x: number, y: number, z: number, cellSize: number) {
  return `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)},${Math.floor(z / cellSize)}`
}

function spansTooMuchOfRoom(box: Box3, roomSize: Vector3, maxRatio: number) {
  box.getSize(tempSize)

  return (
    tempSize.x / roomSize.x >= maxRatio ||
    tempSize.y / roomSize.y >= maxRatio ||
    tempSize.z / roomSize.z >= maxRatio
  )
}

function isFlatFloorLikeSlab(box: Box3, config: CollisionConfig) {
  box.getSize(tempSize)

  return (
    tempSize.y <= config.flatSlabMaxHeight &&
    tempSize.x >= config.flatSlabMinSpan &&
    tempSize.z >= config.flatSlabMinSpan
  )
}

function passesComponentFilters(
  box: Box3,
  roomSize: Vector3,
  roomVolume: number,
  config: CollisionConfig
) {
  box.getSize(tempSize)

  const volume = tempSize.x * tempSize.y * tempSize.z
  if (volume < config.minComponentVolume) {
    return false
  }

  if (volume > roomVolume * config.maxComponentVolumeRatio) {
    return false
  }

  const largestAxis = Math.max(tempSize.x, tempSize.y, tempSize.z)
  const smallestAxis = Math.min(tempSize.x, tempSize.y, tempSize.z)

  if (
    largestAxis < config.minComponentDimension ||
    smallestAxis < config.minComponentThickness
  ) {
    return false
  }

  if (spansTooMuchOfRoom(box, roomSize, config.maxRoomSpanRatio)) {
    return false
  }

  if (isFlatFloorLikeSlab(box, config)) {
    return false
  }

  return true
}

function expandTriangleIntoCell(
  cell: GridCell,
  a: Vector3,
  b: Vector3,
  c: Vector3
) {
  cell.triangleCount += 1
  cell.min.min(a)
  cell.max.max(a)
  cell.min.min(b)
  cell.max.max(b)
  cell.min.min(c)
  cell.max.max(c)
}

export function buildMeshComponentColliders(
  mesh: Mesh,
  worldMatrix: Matrix4,
  roomSize: Vector3,
  roomVolume: number,
  config: CollisionConfig
) {
  if (shouldSkipMesh(mesh.name) || !isFurnitureMesh(mesh.name)) {
    return [] as MeshComponentCollider[]
  }

  const geometry = mesh.geometry
  const position = geometry.getAttribute("position") as BufferAttribute
  const cellSize = config.clusterCellSize

  const triangleA = new Vector3()
  const triangleB = new Vector3()
  const triangleC = new Vector3()
  const worldA = new Vector3()
  const worldB = new Vector3()
  const worldC = new Vector3()
  const cells = new Map<string, GridCell>()

  forEachTriangle(geometry, (indexA, indexB, indexC) => {
    triangleA.fromBufferAttribute(position, indexA)
    triangleB.fromBufferAttribute(position, indexB)
    triangleC.fromBufferAttribute(position, indexC)

    worldA.copy(triangleA).applyMatrix4(worldMatrix)
    worldB.copy(triangleB).applyMatrix4(worldMatrix)
    worldC.copy(triangleC).applyMatrix4(worldMatrix)

    const centroidX = (worldA.x + worldB.x + worldC.x) / 3
    const centroidY = (worldA.y + worldB.y + worldC.y) / 3
    const centroidZ = (worldA.z + worldB.z + worldC.z) / 3
    const key = getGridKey(centroidX, centroidY, centroidZ, cellSize)

    let cell = cells.get(key)
    if (!cell) {
      cell = {
        min: new Vector3(Infinity, Infinity, Infinity),
        max: new Vector3(-Infinity, -Infinity, -Infinity),
        triangleCount: 0,
      }
      cells.set(key, cell)
    }

    expandTriangleIntoCell(cell, worldA, worldB, worldC)
  })

  const colliders: MeshComponentCollider[] = []
  let cellIndex = 0

  for (const cell of cells.values()) {
    if (cell.triangleCount < config.minCellTriangleCount) {
      continue
    }

    const box = new Box3(cell.min, cell.max)

    if (!passesComponentFilters(box, roomSize, roomVolume, config)) {
      continue
    }

    box.expandByScalar(config.meshPadding)
    colliders.push({
      id: `${mesh.name || "mesh"}-cell-${cellIndex++}`,
      box: box.clone(),
    })
  }

  return colliders
}
