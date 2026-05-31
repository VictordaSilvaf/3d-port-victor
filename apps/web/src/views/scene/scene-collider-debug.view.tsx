import { useEffect, useMemo, useState } from "react"
import { Box3Helper, Object3D } from "three"

import { getColliderBoxesForDebug } from "@/lib/scene/build-room-colliders"
import { onCollidersReady } from "@/lib/scene/collision"

export function SceneColliderDebugView() {
  const helperRoot = useMemo(() => new Object3D(), [])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return
    }

    const rebuild = () => {
      helperRoot.clear()

      for (const collider of getColliderBoxesForDebug()) {
        const helper = new Box3Helper(
          collider.box,
          collider.kind === "boundary" ? 0x22c55e : 0xf97316
        )
        helperRoot.add(helper)
      }
    }

    return onCollidersReady(() => {
      rebuild()
      setVisible(true)
    })
  }, [helperRoot])

  if (!import.meta.env.DEV || !visible) {
    return null
  }

  return <primitive object={helperRoot} />
}
