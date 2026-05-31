import type { ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

type AppShellProps = {
  brand: string
  navItems: readonly { id: string; label: string }[]
  activeNavId: string
  onNavSelect: (id: string) => void
  children: ReactNode
}

export function AppShell({
  brand,
  navItems,
  activeNavId,
  onNavSelect,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-svh">
      <aside className="border-border w-56 shrink-0 border-r p-4">
        <p className="mb-6 text-sm font-semibold">{brand}</p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavSelect(item.id)}
              className={cn(
                "rounded-xl px-3 py-2 text-left text-sm transition-colors",
                activeNavId === item.id
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-6">{children}</main>
    </div>
  )
}
