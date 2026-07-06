import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import { searchApi } from "@/lib/api/search.api"
import { resolveMediaUrl } from "@/lib/media"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { ProjectFeedCard } from "@workspace/ui/molecules/project-feed-card"

export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get("q") ?? ""

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchApi.search(q),
    enabled: q.length > 0,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pesquisa</h1>
      {q ? <p className="text-white/70">Resultados para &quot;{q}&quot;</p> : null}
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(data?.projects ?? []).map((p) => (
            <ProjectFeedCard
              key={p.id}
              title={p.title}
              href={`/projects/${p.slug}`}
              description={p.description}
              imageUrl={resolveMediaUrl(p.thumbnail)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
