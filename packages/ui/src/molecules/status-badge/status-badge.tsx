import { Badge } from "@workspace/ui/atoms/badge"
import { cn } from "@workspace/ui/lib/utils"

export type PublishStatus = "draft" | "published" | "archived"

const STATUS_LABELS: Record<PublishStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
}

const statusVariant: Record<
  PublishStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
}

type StatusBadgeProps = {
  status: PublishStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariant[status]} className={cn(className)}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
