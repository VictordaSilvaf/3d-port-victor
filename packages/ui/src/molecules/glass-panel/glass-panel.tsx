import type { ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

type GlassPanelProps = {
  children: ReactNode
  className?: string
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass-surface)] p-6 shadow-lg backdrop-blur-[var(--glass-blur)]",
        className
      )}
    >
      {children}
    </div>
  )
}
