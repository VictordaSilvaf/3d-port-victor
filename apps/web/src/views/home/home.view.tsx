import { Button } from "@workspace/ui/atoms/button"
import { KeyboardHint } from "@workspace/ui/molecules/keyboard-hint"

import type { HomeViewModel } from "@/viewmodels/home/use-home.viewmodel"
import { SceneCanvasView } from "@/views/scene/scene-canvas.view"

type HomeViewProps = HomeViewModel

export function HomeView({ content, scene, isMobileLayout }: HomeViewProps) {
  return (
    <div className="fixed inset-0 h-svh w-svw overflow-hidden">
      <SceneCanvasView scene={scene} />

      <div className="pointer-events-none absolute inset-x-0 top-[max(4.25rem,calc(env(safe-area-inset-top)+4.25rem))] z-10 flex justify-center p-3 sm:top-auto sm:bottom-0 sm:justify-end sm:p-6 sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="bg-background/70 supports-[backdrop-filter]:bg-background/45 pointer-events-auto flex w-full max-w-sm flex-col gap-2 rounded-xl border border-border/80 px-3 py-2.5 text-sm shadow-lg backdrop-blur-md sm:max-w-xs sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3">
          <div>
            <h1 className="text-sm font-semibold sm:text-base">{content.title}</h1>
            <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed sm:text-xs">
              {content.paragraphs[0]}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button size="sm" className="h-8 text-xs sm:h-9 sm:text-sm">
              {content.buttonLabel}
            </Button>
            {!isMobileLayout ? (
              <KeyboardHint
                before={content.keyboardHint.before}
                keys={[...content.keyboardHint.keys]}
                after={content.keyboardHint.after}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
