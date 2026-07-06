import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useCallback } from "react"

import { Button } from "@workspace/ui/atoms/button"
import { cn } from "@workspace/ui/lib/utils"

type MediaCarouselProps = {
  children: React.ReactNode[]
  className?: string
}

export function MediaCarousel({ children, className }: MediaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!children.length) return null

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {children.map((child, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-[min(280px,80vw)]">
              {child}
            </div>
          ))}
        </div>
      </div>
      {children.length > 1 ? (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-background/60 backdrop-blur"
            onClick={scrollPrev}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-background/60 backdrop-blur"
            onClick={scrollNext}
          >
            <ChevronRightIcon />
          </Button>
        </>
      ) : null}
    </div>
  )
}
