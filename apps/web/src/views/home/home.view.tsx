import { KeyboardHint } from "@workspace/ui/molecules/keyboard-hint"
import { ProjectReadyCard } from "@workspace/ui/organisms/project-ready-card"
import { CenteredContentTemplate } from "@workspace/ui/templates/centered-content"

import type { HomeViewModel } from "@/viewmodels/home/use-home.viewmodel"

type HomeViewProps = HomeViewModel

export function HomeView({ content }: HomeViewProps) {
  return (
    <CenteredContentTemplate>
      <ProjectReadyCard
        title={content.title}
        paragraphs={content.paragraphs}
        buttonLabel={content.buttonLabel}
      />
      <KeyboardHint
        before={content.keyboardHint.before}
        keys={[...content.keyboardHint.keys]}
        after={content.keyboardHint.after}
      />
    </CenteredContentTemplate>
  )
}
