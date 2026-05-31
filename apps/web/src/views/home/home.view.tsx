import { Button } from "@workspace/ui/atoms/button"
import { KeyboardHint } from "@workspace/ui/molecules/keyboard-hint"

import type { HomeViewModel } from "@/viewmodels/home/use-home.viewmodel"
import { SceneCanvasView } from "@/views/scene/scene-canvas.view"

type HomeViewProps = HomeViewModel

export function HomeView({ content, scene }: HomeViewProps) {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="fixed inset-0 z-0 bg-background">
        <SceneCanvasView scene={scene} />
      </div>

      <div className="pointer-events-none relative z-10 flex min-h-svh p-6">
        <div className="bg-background/75 supports-[backdrop-filter]:bg-background/55 pointer-events-auto flex max-w-md min-w-0 flex-col gap-4 rounded-3xl border border-border p-6 text-sm leading-loose shadow-lg backdrop-blur-md">
          <div>
            <h1 className="text-lg font-semibold">{content.title}</h1>
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground mt-2">
                {paragraph}
              </p>
            ))}
            <Button className="mt-4">{content.buttonLabel}</Button>
          </div>
          <KeyboardHint
            before={content.keyboardHint.before}
            keys={[...content.keyboardHint.keys]}
            after={content.keyboardHint.after}
          />
        </div>
      </div>
    </div>
  )
}
