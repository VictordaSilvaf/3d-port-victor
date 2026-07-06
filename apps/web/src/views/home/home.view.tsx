import { SearchIcon } from "lucide-react"
import { useState } from "react"

import { Input } from "@workspace/ui/atoms/input"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { MediaCarousel } from "@workspace/ui/molecules/media-carousel"
import { ProjectFeedCard } from "@workspace/ui/molecules/project-feed-card"

import { BlockRenderer } from "@/views/blocks/block-renderer.view"
import type { useHomeViewModel } from "@/viewmodels/home/use-home.viewmodel"

type HomeViewProps = ReturnType<typeof useHomeViewModel>

export function HomeView({
  page,
  isLoading,
  featured,
  recent,
  goSearch,
  resolveMediaUrl,
}: HomeViewProps) {
  const [query, setQuery] = useState("")

  if (isLoading) return <Skeleton className="h-96 w-full" />

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold">{page?.title ?? "Feed"}</h1>
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault()
            if (query.trim()) goSearch(query.trim())
          }}
        >
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Pesquisar projetos…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50"
          />
        </form>
      </header>

      {page?.blocks?.length ? (
        <BlockRenderer blocks={page.blocks} projects={[...featured, ...recent]} />
      ) : null}

      {featured.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Destaques</h2>
          <MediaCarousel>
            {featured.map((p) => (
              <ProjectFeedCard
                key={p.id}
                title={p.title}
                href={`/projects/${p.slug}`}
                description={p.description}
                imageUrl={resolveMediaUrl(p.cover ?? p.thumbnail)}
                featured={p.featured}
                views={p.views}
              />
            ))}
          </MediaCarousel>
        </section>
      ) : null}

      {recent.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Projetos recentes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {recent.map((p) => (
              <ProjectFeedCard
                key={p.id}
                title={p.title}
                href={`/projects/${p.slug}`}
                description={p.description}
                imageUrl={resolveMediaUrl(p.thumbnail ?? p.cover)}
                views={p.views}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
