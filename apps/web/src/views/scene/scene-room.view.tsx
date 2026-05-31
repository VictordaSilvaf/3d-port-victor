import { useGLTF } from "@react-three/drei"
import gsap from "gsap"
import { useLayoutEffect, useMemo, useRef } from "react"
import { Box3, Group, Vector3 } from "three"

import { buildRoomColliders } from "@/lib/scene/build-room-colliders"
import { clearRoomColliders } from "@/lib/scene/collision"
import { setRoomPointerRaycast } from "@/lib/scene/room-pointer"
import { SCENE_MODEL } from "@/models/scene/scene.model"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"
import type { SceneViewModel } from "@/viewmodels/scene/use-scene.viewmodel"

type SceneRoomViewProps = Pick<
  SceneViewModel,
  "modelScale" | "position"
>

const tempSize = new Vector3()
const tempCenter = new Vector3()

export function SceneRoomView({ modelScale, position }: SceneRoomViewProps) {
  const groupRef = useRef<Group>(null)
  const controlMode = useSceneControlsStore((state) => state.controlMode)
  const { scene } = useGLTF(SCENE_MODEL.asset.garageGlbUrl)
  const room = useMemo(() => scene.clone(true), [scene])

  useLayoutEffect(() => {
    setRoomPointerRaycast(room, controlMode !== "orbit")
  }, [room, controlMode])

  useLayoutEffect(() => {
    const group = groupRef.current
    if (!group) {
      return
    }

    room.position.set(0, 0, 0)
    room.scale.setScalar(1)
    room.updateMatrixWorld(true)

    const box = new Box3().setFromObject(room)
    box.getSize(tempSize)
    box.getCenter(tempCenter)

    const maxDim = Math.max(tempSize.x, tempSize.y, tempSize.z)
    const fitScale =
      (SCENE_MODEL.room.fitTargetSize / maxDim) * modelScale

    room.scale.setScalar(fitScale)
    room.position.sub(tempCenter.clone().multiplyScalar(fitScale))
    room.position.add(new Vector3(...position))

    group.scale.setScalar(0.001)
    gsap.to(group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: SCENE_MODEL.animation.introDuration,
      ease: SCENE_MODEL.animation.introEase,
      onComplete: () => {
        room.updateMatrixWorld(true)
        buildRoomColliders(room)
      },
    })
  }, [room, modelScale, position])

  useLayoutEffect(() => {
    return () => {
      clearRoomColliders()
    }
  }, [])

  return (
    <group ref={groupRef}>
      <primitive object={room} />
    </group>
  )
}

useGLTF.preload(SCENE_MODEL.asset.garageGlbUrl)
