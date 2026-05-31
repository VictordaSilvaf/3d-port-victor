import { Button } from "@workspace/ui/atoms/button"
import { KeyboardHint } from "@workspace/ui/molecules/keyboard-hint"

import type { HomeViewModel } from "@/viewmodels/home/use-home.viewmodel"
import { SceneCanvasView } from "@/views/scene/scene-canvas.view"

type HomeViewProps = HomeViewModel

export function HomeView({ content, scene }: HomeViewProps) {
  return (
    <div className="fixed inset-0 h-svh w-svw overflow-hidden">
      <SceneCanvasView scene={scene} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-4 sm:justify-end sm:p-6">
        <div className="bg-background/70 supports-[backdrop-filter]:bg-background/45 pointer-events-auto flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border/80 px-4 py-3 text-sm shadow-lg backdrop-blur-md sm:max-w-xs">
          <div>
            <h1 className="font-semibold">{content.title}</h1>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {content.paragraphs[0]}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button size="sm">{content.buttonLabel}</Button>
            <KeyboardHint
              before={content.keyboardHint.before}
              keys={[...content.keyboardHint.keys]}
              after={content.keyboardHint.after}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
