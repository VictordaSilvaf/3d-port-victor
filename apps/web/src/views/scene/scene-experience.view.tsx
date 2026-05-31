import { useFrame } from "@react-three/fiber"
import {
  Environment,
  Float,
  Grid,
  MeshDistortMaterial,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei"
import gsap from "gsap"
import { useLayoutEffect, useRef } from "react"
import type { Mesh } from "three"

import { SCENE_MODEL } from "@/models/scene/scene.model"
import type { SceneViewModel } from "@/viewmodels/scene/use-scene.viewmodel"

type SceneExperienceViewProps = SceneViewModel

export function SceneExperienceView({
  rotationSpeed,
  distort,
  radius,
  color,
  metalness,
  roughness,
  autoRotate,
  showGrid,
  environmentPreset,
}: SceneExperienceViewProps) {
  const meshRef = useRef<Mesh>(null)

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }

    mesh.scale.setScalar(0)

    gsap.to(mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: SCENE_MODEL.animation.introDuration,
      ease: SCENE_MODEL.animation.introEase,
    })
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current || !autoRotate) {
      return
    }

    meshRef.current.rotation.y += delta * rotationSpeed
  })

  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={SCENE_MODEL.camera.fov}
        position={[...SCENE_MODEL.camera.position]}
        near={SCENE_MODEL.camera.near}
        far={SCENE_MODEL.camera.far}
      />

      <ambientLight intensity={SCENE_MODEL.lights.ambientIntensity} />
      <directionalLight
        position={[...SCENE_MODEL.lights.directionalPosition]}
        intensity={SCENE_MODEL.lights.directionalIntensity}
      />

      <Environment preset={environmentPreset} />

      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.35}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[radius, 20]} />
          <MeshDistortMaterial
            color={color}
            metalness={metalness}
            roughness={roughness}
            distort={distort}
            speed={2}
          />
        </mesh>
      </Float>

      {showGrid ? (
        <Grid
          infiniteGrid
          fadeDistance={28}
          fadeStrength={1.2}
          cellSize={0.6}
          sectionSize={3}
        />
      ) : null}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={12}
        autoRotate={autoRotate}
        autoRotateSpeed={rotationSpeed * 2}
      />
    </>
  )
}
