import ReactMarkdown from "react-markdown"

import { Button } from "@workspace/ui/atoms/button"
import { GlassPanel } from "@workspace/ui/molecules/glass-panel"
import { ProjectFeedCard } from "@workspace/ui/molecules/project-feed-card"

import type { PageBlock, ProjectSummary } from "@/lib/api/types"
import { resolveMediaUrl } from "@/lib/media"

type BlockRendererProps = {
  blocks: PageBlock[]
  projects?: ProjectSummary[]
  onContactForm?: React.ReactNode
}

function HeroBlock({ payload }: { payload: Record<string, unknown> }) {
  const imageUrl = resolveMediaUrl(
    (payload.image_url as string) ?? (payload.image as string) ?? null
  )
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="aspect-[21/9] w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 p-6">
        <h2 className="text-2xl font-bold">{String(payload.headline ?? "")}</h2>
        {payload.subheadline ? (
          <p className="text-white/80 mt-1">{String(payload.subheadline)}</p>
        ) : null}
        {payload.cta && typeof payload.cta === "object" ? (
          <Button className="mt-4" asChild>
            <a href={String((payload.cta as { href: string }).href)}>
              {String((payload.cta as { label: string }).label)}
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export function BlockRenderer({ blocks, projects = [], onContactForm }: BlockRendererProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const payload = block.payload ?? {}

        switch (block.type) {
          case "hero":
            return <HeroBlock key={i} payload={payload} />

          case "markdown":
            return (
              <GlassPanel key={i} className="prose prose-invert max-w-none">
                <ReactMarkdown>{String(payload.content ?? "")}</ReactMarkdown>
              </GlassPanel>
            )

          case "image": {
            const url = resolveMediaUrl(
              (payload.url as string) ?? (payload.path as string) ?? null
            )
            return url ? (
              <figure key={i}>
                <img src={url} alt={String(payload.caption ?? "")} className="rounded-2xl" />
              </figure>
            ) : null
          }

          case "gallery": {
            const images = (payload.images as Array<{ url?: string; path?: string }>) ?? []
            return (
              <div key={i} className="grid gap-3 sm:grid-cols-2">
                {images.map((img, j) => {
                  const url = resolveMediaUrl(img.url ?? img.path ?? null)
                  return url ? (
                    <img key={j} src={url} alt="" className="rounded-2xl object-cover" />
                  ) : null
                })}
              </div>
            )
          }

          case "featured_projects":
          case "project_list": {
            const ids = (payload.project_ids as string[]) ?? []
            const list = ids.length
              ? projects.filter((p) => ids.includes(p.id))
              : projects
            return (
              <div key={i} className="grid gap-4 sm:grid-cols-2">
                {list.map((p) => (
                  <ProjectFeedCard
                    key={p.id}
                    title={p.title}
                    href={`/projects/${p.slug}`}
                    description={p.description}
                    imageUrl={resolveMediaUrl(p.thumbnail ?? p.cover)}
                    views={p.views}
                    featured={p.featured}
                  />
                ))}
              </div>
            )
          }

          case "tech_stack": {
            const techs = (payload.technologies as Array<{ name: string }>) ?? []
            return (
              <div key={i} className="flex flex-wrap gap-2">
                {techs.map((t, j) => (
                  <span key={j} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                    {t.name}
                  </span>
                ))}
              </div>
            )
          }

          case "cta":
            return (
              <div key={i} className="text-center">
                <Button asChild size="lg">
                  <a href={String(payload.href ?? "#")}>{String(payload.label ?? "Saiba mais")}</a>
                </Button>
              </div>
            )

          case "embed":
            return payload.url ? (
              <iframe
                key={i}
                src={String(payload.url)}
                className="aspect-video w-full rounded-2xl"
                title="embed"
              />
            ) : null

          case "spacer": {
            const size = String(payload.size ?? "md")
            const h = size === "sm" ? "h-4" : size === "lg" ? "h-16" : "h-8"
            return <div key={i} className={h} />
          }

          case "contact_form":
            return onContactForm ? <div key={i}>{onContactForm}</div> : null

          default:
            return null
        }
      })}
    </div>
  )
}
