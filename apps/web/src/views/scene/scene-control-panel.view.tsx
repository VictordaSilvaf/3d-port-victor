import { Button } from "@workspace/ui/atoms/button"

import { useSceneControlsStore } from "@/stores/scene/scene-controls.store"

export function SceneControlPanelView() {
  const controlMode = useSceneControlsStore((state) => state.controlMode)
  const showCrosshair = useSceneControlsStore((state) => state.showCrosshair)
  const lookEnabled = useSceneControlsStore((state) => state.lookEnabled)
  const orbitEnabled = useSceneControlsStore((state) => state.orbitEnabled)
  const pointerLocked = useSceneControlsStore((state) => state.pointerLocked)

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
    <div className="pointer-events-auto absolute top-4 right-4 z-30 flex max-w-xs flex-col gap-2 sm:right-auto sm:left-1/2 sm:-translate-x-1/2">
      <div className="bg-background/85 supports-[backdrop-filter]:bg-background/60 flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-border p-2 shadow-lg backdrop-blur-md">
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
        {controlMode === "look" ? (
          <ModeButton
            active={pointerLocked}
            label={pointerLocked ? "Liberar mouse" : "Capturar mouse"}
            onClick={togglePointerLock}
          />
        ) : null}
      </div>
      <p className="text-muted-foreground bg-background/70 rounded-lg px-2 py-1 text-center text-[10px] backdrop-blur-sm">
        {controlMode === "look"
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
