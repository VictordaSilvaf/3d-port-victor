import { KeyboardHint } from "@workspace/ui/molecules/keyboard-hint"
import { StatCard } from "@workspace/ui/molecules/stat-card"
import { AppShell } from "@workspace/ui/organisms/app-shell"

import type { DashboardViewModel } from "@/viewmodels/dashboard/use-dashboard.viewmodel"

type DashboardViewProps = DashboardViewModel

export function DashboardView({
  brand,
  title,
  subtitle,
  navItems,
  activeSectionId,
  activeSection,
  selectSection,
}: DashboardViewProps) {
  return (
    <AppShell
      brand={brand}
      navItems={navItems}
      activeNavId={activeSectionId}
      onNavSelect={selectSection}
    >
      <header className="mb-8 space-y-1">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-base font-semibold">{activeSection.title}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {activeSection.stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
            />
          ))}
        </div>
      </section>

      <div className="mt-8">
        <KeyboardHint
          before="(Press"
          keys={["p"]}
          after="to toggle dark mode)"
        />
      </div>
    </AppShell>
  )
}
