export const SCENE_MODEL = {
  camera: {
    fov: 45,
    position: [0, 0, 6] as const,
    near: 0.1,
    far: 100,
  },
  lights: {
    ambientIntensity: 0.4,
    directionalIntensity: 1.2,
    directionalPosition: [4, 6, 4] as const,
  },
  defaults: {
    rotationSpeed: 0.35,
    distort: 0.35,
    radius: 1.15,
    color: "#6366f1",
    metalness: 0.65,
    roughness: 0.2,
    autoRotate: true,
    showGrid: false,
    environmentPreset: "city" as const,
  },
  animation: {
    introDuration: 1.4,
    introEase: "power3.out",
  },
} as const

export type SceneEnvironmentPreset =
  (typeof SCENE_MODEL.defaults)["environmentPreset"]

export type SceneDefaults = typeof SCENE_MODEL.defaults
