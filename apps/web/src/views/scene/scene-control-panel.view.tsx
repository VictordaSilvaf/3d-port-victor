import { Button } from "@workspace/ui/atoms/button"

import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"

export function SceneControlPanelView() {
  const controlMode = useSceneControlsStore((state) => state.controlMode)
  const showCrosshair = useSceneControlsStore((state) => state.showCrosshair)
  const lookEnabled = useSceneControlsStore((state) => state.lookEnabled)
  const orbitEnabled = useSceneControlsStore((state) => state.orbitEnabled)
  const pointerLocked = useSceneControlsStore((state) => state.pointerLocked)
  const isMobileLayout = useSceneControlsStore((state) => state.isMobileLayout)

  const setControlMode = useSceneControlsStore((state) => state.setControlMode)
  const toggleCrosshair = useSceneControlsStore((state) => state.toggleCrosshair)
  const setLookEnabled = useSceneControlsStore((state) => state.setLookEnabled)
  const setOrbitEnabled = useSceneControlsStore((state) => state.setOrbitEnabled)
  const togglePointerLock = useSceneControlsStore(
    (state) => state.togglePointerLock
  )
  const exitPointerLock = useSceneControlsStore((state) => state.exitPointerLock)

  const activateLook = () => {
    setControlMode("look")
    setLookEnabled(true)
  }

  const activateOrbit = () => {
    exitPointerLock()
    setControlMode("orbit")
    setOrbitEnabled(true)
  }

  return (
    <div className="pointer-events-auto absolute top-3 right-3 z-30 flex max-w-[min(100%,20rem)] flex-col gap-1.5 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] sm:top-4 sm:right-4 sm:max-w-xs sm:gap-2 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:pt-0 sm:pr-0">
      <div className="bg-background/85 supports-[backdrop-filter]:bg-background/60 flex flex-wrap items-center justify-center gap-1 rounded-xl border border-border p-1.5 shadow-lg backdrop-blur-md sm:gap-1.5 sm:rounded-2xl sm:p-2">
        <ModeButton
          active={controlMode === "orbit" && orbitEnabled}
          label="Órbita"
          onClick={activateOrbit}
        />
        <ModeButton
          active={controlMode === "look" && lookEnabled}
          label="Olhar (FPS)"
          onClick={activateLook}
        />
        <ModeButton
          active={showCrosshair}
          label="Mira"
          onClick={toggleCrosshair}
          disabled={controlMode !== "look"}
        />
        {controlMode === "look" && !isMobileLayout ? (
          <ModeButton
            active={pointerLocked}
            label={pointerLocked ? "Liberar mouse" : "Capturar mouse"}
            onClick={togglePointerLock}
          />
        ) : null}
      </div>
      <p className="text-muted-foreground bg-background/70 rounded-lg px-2 py-1 text-center text-[10px] leading-snug backdrop-blur-sm">
        {isMobileLayout
          ? controlMode === "look"
            ? "Joystick no centro move · arraste fora dele para olhar"
            : "Dois dedos: pinça zoom · arraste orbitar"
          : controlMode === "look"
            ? "Clique na cena ou Capturar mouse · WASD move · Esc libera · L alterna"
            : "Arraste (esq.) orbitar · Scroll zoom · WASD move · L = modo olhar"}
      </p>
    </div>
  )
}

function ModeButton({
  active,
  label,
  onClick,
  disabled = false,
}: {
  active: boolean
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      disabled={disabled}
      onClick={onClick}
      className="h-7 px-2.5 text-xs"
    >
      {label}
    </Button>
  )
}
