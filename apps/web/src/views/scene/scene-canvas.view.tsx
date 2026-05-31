import { Canvas } from "@react-three/fiber"
import { KeyboardControls, Loader, type KeyboardControlsEntry } from "@react-three/drei"
import { Suspense } from "react"

import {
  getInitialCameraRig,
  SCENE_MODEL,
  type SceneMovementKey,
} from "@/models/scene/scene.model"
import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"
import type { SceneViewModel } from "@/viewmodels/scene/use-scene.viewmodel"

import { SceneControlPanelView } from "./scene-control-panel.view"
import { SceneCrosshairView } from "./scene-crosshair.view"
import { SceneDebugTrackerView } from "./scene-debug-tracker.view"
import { SceneExperienceView } from "./scene-experience.view"
import { SceneKeyboardMovementView } from "./scene-keyboard-movement.view"
import { SceneColliderDebugView } from "./scene-collider-debug.view"
import { SceneFpsControllerView } from "./scene-fps-controller.view"
import { SceneTouchLookZoneView } from "./scene-touch-look-zone.view"
import { SceneVirtualJoystickView } from "./scene-virtual-joystick.view"
import { SceneViewportHostView } from "./scene-viewport-host.view"

type SceneCanvasViewProps = {
  scene: SceneViewModel
}

const initialCameraRig = getInitialCameraRig()

export function SceneCanvasView({ scene }: SceneCanvasViewProps) {
  const viewport = useSceneControlsStore((state) => state.viewportElement)

  return (
    <KeyboardControls
      map={
        SCENE_MODEL.movement
          .keyboardMap as unknown as KeyboardControlsEntry<SceneMovementKey>[]
      }
      domElement={viewport ?? undefined}
    >
      <SceneViewportHostView>
        <SceneTouchLookZoneView />
        <SceneVirtualJoystickView />
        <SceneControlPanelView />
        <SceneCrosshairView />
        <Canvas
          className="h-full w-full touch-none"
          dpr={[1, 2]}
          shadows
          gl={{ antialias: true, alpha: false }}
          camera={{
            fov: initialCameraRig.fov,
            near: SCENE_MODEL.camera.near,
            far: SCENE_MODEL.camera.far,
            position: initialCameraRig.position,
            rotation: initialCameraRig.rotation,
          }}
        >
          <color attach="background" args={["#0a0a0b"]} />
          <Suspense fallback={null}>
            <SceneExperienceView {...scene} />
            <SceneFpsControllerView />
            <SceneKeyboardMovementView />
            {import.meta.env.DEV ? <SceneColliderDebugView /> : null}
            {import.meta.env.DEV ? <SceneDebugTrackerView /> : null}
          </Suspense>
        </Canvas>
      </SceneViewportHostView>
      <Loader
        containerStyles={{
          background: "rgba(10, 10, 11, 0.92)",
        }}
        innerStyles={{
          width: "280px",
          height: "2px",
          background: "hsl(var(--muted))",
        }}
        barStyles={{
          background: "hsl(var(--primary))",
        }}
        dataInterpolation={(p) => `Carregando garagem ${p.toFixed(0)}%`}
      />
    </KeyboardControls>
  )
}
