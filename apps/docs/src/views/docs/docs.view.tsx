import { DocSection } from "@workspace/ui/molecules/doc-section"
import { KeyboardHint } from "@workspace/ui/molecules/keyboard-hint"
import { AppShell } from "@workspace/ui/organisms/app-shell"

import type { DocParagraph } from "@/models/docs/docs.model"
import type { DocsViewModel } from "@/viewmodels/docs/use-docs.viewmodel"

type DocsViewProps = DocsViewModel

function DocParagraphBlock({ paragraph }: { paragraph: DocParagraph }) {
  if (typeof paragraph === "string") {
    return <p>{paragraph}</p>
  }

  return (
    <pre className="bg-muted text-foreground overflow-x-auto rounded-xl p-3 font-mono text-xs">
      {paragraph.value}
    </pre>
  )
}

export function DocsView({
  brand,
  title,
  subtitle,
  navItems,
  activeSectionId,
  activeSection,
  selectSection,
}: DocsViewProps) {
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

      <DocSection id={activeSection.id} title={activeSection.title}>
        {activeSection.paragraphs.map((paragraph, index) => (
          <DocParagraphBlock
            key={
              typeof paragraph === "string"
                ? `${activeSection.id}-${index}-${paragraph}`
                : `${activeSection.id}-${index}-${paragraph.value}`
            }
            paragraph={paragraph}
          />
        ))}
      </DocSection>

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
