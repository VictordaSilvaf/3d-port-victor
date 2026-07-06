import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import { pagesApi } from "@/lib/api/pages.api"
import { projectsApi } from "@/lib/api/projects.api"
import { usePageMeta } from "@/lib/seo"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { BlockRenderer } from "@/views/blocks/block-renderer.view"

export function CmsPage() {
  const { slug } = useParams<{ slug: string }>()

  const pageQuery = useQuery({
    queryKey: ["pages", slug],
    queryFn: async () => (await pagesApi.bySlug(slug!)).data,
    enabled: !!slug,
  })

  const projectsQuery = useQuery({
    queryKey: ["projects", "cms"],
    queryFn: async () => (await projectsApi.list({ per_page: 20 })).data,
  })

  const page = pageQuery.data
  usePageMeta(page)

  if (pageQuery.isLoading) return <Skeleton className="h-96 w-full" />
  if (!page) return <p>Página não encontrada.</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <BlockRenderer blocks={page.blocks} projects={projectsQuery.data ?? []} />
    </div>
  )
}
