import type { ReactNode } from "react"

type DocSectionProps = {
  id: string
  title: string
  children: ReactNode
}

export function DocSection({ id, title, children }: DocSectionProps) {
  return (
    <section id={id} className="scroll-mt-6 space-y-2">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="text-muted-foreground space-y-2 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  )
}
