import { MathUtils } from "three"

import garageModelUrl from "@/assets/3d/rick_and_morty_garage_fan_art.glb"

export const SCENE_MODEL = {
  asset: {
    garageGlbUrl: garageModelUrl,
  },
  camera: {
    fov: 50,
    /** Fallback: offset em relação ao centro da garagem */
    offset: [4.48, -0.59, 1.75] as [number, number, number],
    /** Posição inicial exata (snapshot dev) */
    initialPosition: [
      0.19516170452021214, 1.311890773513988, -1.6078925819428276,
    ] as [number, number, number],
    /** Rotação inicial em graus (Euler YXZ: pitch, yaw, roll) */
    initialRotationDeg: [
      -2.195121951219506, 74.65322702859149, 0,
    ] as [number, number, number],
    near: 0.1,
    far: 200,
  },
  lights: {
    ambientIntensity: 0.85,
    directionalIntensity: 1.4,
    directionalPosition: [5, 8, 5] as const,
  },
  room: {
    fitTargetSize: 6,
  },
  controls: {
    minDistance: 0.5,
    maxDistance: 18,
    targetOffset: [-0.03, -0.77, 0.16] as [number, number, number],
    /** Alvo da órbita no primeiro frame (snapshot dev) */
    initialTarget: [
      -0.28665531254722915, 1.2927394066689704, -1.7401256610577016,
    ] as [number, number, number],
    /** Órbita inicial (snapshot dev) */
    initialOrbit: {
      azimuthDeg: 74.65322702859144,
      polarDeg: 87.8048780487805,
      distance: 0.5,
    },
  },
  defaults: {
    modelScale: 1.82,
    position: [-3.7, 2.12, -3.43] as [number, number, number],
    rotationSpeed: 0.15,
    autoRotate: false,
    useEnvironment: true,
    environmentPreset: "apartment" as const,
    ambientIntensity: 0.85,
    directionalIntensity: 1.4,
  },
  animation: {
    introDuration: 1.2,
    introEase: "power3.out",
  },
  movement: {
    speed: 4.5,
    keyboardMap: [
      { name: "forward", keys: ["ArrowUp", "w", "W"] },
      { name: "backward", keys: ["ArrowDown", "s", "S"] },
      { name: "left", keys: ["ArrowLeft", "a", "A"] },
      { name: "right", keys: ["ArrowRight", "d", "D"] },
    ],
  },
  locomotion: {
    maxSpeed: 4.5,
    acceleration: 16,
    deceleration: 12,
    bob: {
      frequency: 5.5,
      verticalAmp: 0.012,
      horizontalAmp: 0.008,
      rollAmp: 0.01,
    },
    idleBreath: {
      frequency: 1.15,
      verticalAmp: 0.005,
    },
  },
  look: {
    sensitivity: 0.003,
    touchSensitivity: 0.008,
    minPolarDeg: -85,
    maxPolarDeg: 85,
  },
  touch: {
    joystickRadius: 52,
    joystickDeadZone: 0.12,
  },
  collision: {
    radius: 0.36,
    bodyHeightOffset: 1.35,
    wallInset: 0.22,
    floorInset: 0.05,
    ceilingInset: 0.15,
    meshPadding: 0.05,
    clusterCellSize: 1.25,
    minCellTriangleCount: 1,
    minComponentVolume: 0.0008,
    maxComponentVolumeRatio: 0.12,
    minComponentDimension: 0.05,
    minComponentThickness: 0.015,
    maxRoomSpanRatio: 0.55,
    flatSlabMaxHeight: 0.14,
    flatSlabMinSpan: 1.2,
  },
} as const

export const SCENE_ENVIRONMENT_PRESETS = [
  "city",
  "sunset",
  "dawn",
  "night",
  "warehouse",
  "forest",
  "apartment",
  "studio",
  "park",
  "lobby",
] as const

export type SceneMovementKey = "forward" | "backward" | "left" | "right"

export type SceneEnvironmentPreset = (typeof SCENE_ENVIRONMENT_PRESETS)[number]

export type SceneDefaults = {
  modelScale: number
  position: [number, number, number]
  rotationSpeed: number
  autoRotate: boolean
  useEnvironment: boolean
  environmentPreset: SceneEnvironmentPreset
  ambientIntensity: number
  directionalIntensity: number
}

export function getInitialLookAngles() {
  const [pitchDeg, yawDeg] = SCENE_MODEL.camera.initialRotationDeg

  return {
    yaw: MathUtils.degToRad(yawDeg),
    pitch: MathUtils.degToRad(pitchDeg),
  }
}

export function getInitialCameraRig() {
  const [pitchDeg, yawDeg, rollDeg] = SCENE_MODEL.camera.initialRotationDeg

  return {
    position: [...SCENE_MODEL.camera.initialPosition] as [
      number,
      number,
      number,
    ],
    rotation: [
      MathUtils.degToRad(pitchDeg),
      MathUtils.degToRad(yawDeg),
      MathUtils.degToRad(rollDeg),
    ] as [number, number, number],
    fov: SCENE_MODEL.camera.fov,
  }
}

export function getSceneFocusFromPosition(
  position: readonly [number, number, number]
) {
  return {
    target: [
      position[0] + SCENE_MODEL.controls.targetOffset[0],
      position[1] + SCENE_MODEL.controls.targetOffset[1],
      position[2] + SCENE_MODEL.controls.targetOffset[2],
    ] as [number, number, number],
    cameraPosition: [
      position[0] + SCENE_MODEL.camera.offset[0],
      position[1] + SCENE_MODEL.camera.offset[1],
      position[2] + SCENE_MODEL.camera.offset[2],
    ] as [number, number, number],
  }
}
