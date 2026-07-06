import { Badge } from "@workspace/ui/atoms/badge"
import { GlassPanel } from "@workspace/ui/molecules/glass-panel"
import { cn } from "@workspace/ui/lib/utils"

export type ProjectFeedCardProps = {
  title: string
  href: string
  description?: string
  imageUrl?: string | null
  views?: number
  featured?: boolean
  className?: string
}

export function ProjectFeedCard({
  title,
  href,
  description,
  imageUrl,
  views,
  featured,
  className,
}: ProjectFeedCardProps) {
  return (
    <a href={href} className={cn("block", className)}>
      <GlassPanel className="overflow-hidden p-0 transition-transform hover:scale-[1.01]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="aspect-[16/10] w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold">{title}</h3>
            {featured ? <Badge variant="secondary">Destaque</Badge> : null}
          </div>
          {description ? (
            <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
          ) : null}
          {views !== undefined ? (
            <p className="text-muted-foreground text-xs">{views} visualizações</p>
          ) : null}
        </div>
      </GlassPanel>
    </a>
  )
}
