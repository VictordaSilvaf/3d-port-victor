import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"

export function SceneCrosshairView() {
  const showCrosshair = useSceneControlsStore((state) => state.showCrosshair)
  const controlMode = useSceneControlsStore((state) => state.controlMode)
  const pointerLocked = useSceneControlsStore((state) => state.pointerLocked)

  if (!showCrosshair || controlMode !== "look") {
    return null
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      aria-hidden
    >
      <div
        className={`relative size-5 transition-opacity ${
          pointerLocked ? "opacity-100" : "opacity-60"
        }`}
      >
        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white/90 shadow-[0_0_6px_rgba(0,0,0,0.8)]" />
        <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-white/90 shadow-[0_0_6px_rgba(0,0,0,0.8)]" />
        <span className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.9)]" />
      </div>
    </div>
  )
}
