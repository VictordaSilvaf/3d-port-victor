import { Mesh, Object3D } from "three"

const originalRaycasts = new WeakMap<Mesh, Mesh["raycast"]>()

/** Desativa raycast nas meshes da sala para o OrbitControls receber o botão esquerdo. */
export function setRoomPointerRaycast(root: Object3D, enabled: boolean) {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return
    }

    if (!enabled) {
      if (!originalRaycasts.has(child)) {
        originalRaycasts.set(child, child.raycast.bind(child))
      }
      child.raycast = () => {}
      return
    }

    const original = originalRaycasts.get(child)
    if (original) {
      child.raycast = original
      originalRaycasts.delete(child)
    }
  })
}
