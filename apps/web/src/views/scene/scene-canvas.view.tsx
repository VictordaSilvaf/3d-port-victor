import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"

import type { SceneViewModel } from "@/viewmodels/scene/use-scene.viewmodel"

import { SceneExperienceView } from "./scene-experience.view"

type SceneCanvasViewProps = {
  scene: SceneViewModel
}

export function SceneCanvasView({ scene }: SceneCanvasViewProps) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <SceneExperienceView {...scene} />
      </Suspense>
    </Canvas>
  )
}
