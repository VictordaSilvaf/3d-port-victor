import { useState } from "react"

import { useSceneDebugViewModel } from "@/viewmodels/scene/use-scene-debug.viewmodel"

export function SceneDebugBarView() {
  const {
    rows,
    isPaused,
    togglePaused,
    copySnapshotJson,
    copyConfigSnippet,
    resetScene,
    cameraOffset,
    targetOffset,
  } = useSceneDebugViewModel()

  const [collapsed, setCollapsed] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (label: string, action: () => Promise<void>) => {
    await action()
    setCopied(label)
    window.setTimeout(() => setCopied(null), 1500)
  }

  return (
    <aside
      className="bg-background/90 supports-[backdrop-filter]:bg-background/75 pointer-events-auto fixed top-4 left-4 z-50 max-h-[calc(100svh-2rem)] w-80 overflow-hidden rounded-2xl border border-border font-mono text-xs shadow-xl backdrop-blur-md"
      aria-label="Painel de debug da cena 3D"
    >
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div>
          <p className="text-foreground font-semibold">Dev — Câmera & Cena</p>
          <p className="text-muted-foreground text-[10px]">
            Atualização em tempo real
          </p>
        </div>
        <div className="flex gap-1">
          <DebugButton
            label={collapsed ? "▼" : "▲"}
            onClick={() => setCollapsed((value) => !value)}
            title={collapsed ? "Expandir" : "Recolher"}
          />
          <DebugButton
            label={isPaused ? "▶" : "⏸"}
            onClick={togglePaused}
            title={isPaused ? "Retomar leitura" : "Pausar leitura"}
          />
        </div>
      </header>

      {!collapsed ? (
        <div className="flex max-h-[calc(100svh-8rem)] flex-col">
          <dl className="grid gap-1.5 overflow-y-auto px-3 py-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[7.5rem_1fr] gap-2 rounded-lg bg-muted/40 px-2 py-1.5"
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="text-foreground break-all">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="text-muted-foreground space-y-1 border-t border-border px-3 py-2 text-[10px]">
            <p>offset câmera: [{cameraOffset.join(", ")}]</p>
            <p>offset alvo: [{targetOffset.join(", ")}]</p>
          </div>

          <div className="flex flex-wrap gap-1 border-t border-border p-2">
            <DebugButton
              label={copied === "json" ? "OK" : "JSON"}
              onClick={() => handleCopy("json", copySnapshotJson)}
            />
            <DebugButton
              label={copied === "config" ? "OK" : "Config"}
              onClick={() => handleCopy("config", copyConfigSnippet)}
              title="Copia snippet para scene.model.ts"
            />
            <DebugButton
              label="Reset"
              onClick={resetScene}
              title="Restaura defaults do Zustand"
            />
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function DebugButton({
  label,
  onClick,
  title,
}: {
  label: string
  onClick: () => void
  title?: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="bg-muted hover:bg-muted/80 text-foreground rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
    >
      {label}
    </button>
  )
}
