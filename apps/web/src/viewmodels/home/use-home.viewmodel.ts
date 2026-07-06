import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { pagesApi } from "@/lib/api/pages.api"
import { projectsApi } from "@/lib/api/projects.api"
import { resolveMediaUrl } from "@/lib/media"
import { usePageMeta } from "@/lib/seo"

export function useHomeViewModel() {
  const navigate = useNavigate()

  const pageQuery = useQuery({
    queryKey: ["pages", "home"],
    queryFn: async () => (await pagesApi.home()).data,
  })

  const featuredQuery = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: async () =>
      (
        await projectsApi.list({
          featured: true,
          per_page: 6,
          sort: "published_at",
          direction: "desc",
        })
      ).data,
  })

  const recentQuery = useQuery({
    queryKey: ["projects", "recent"],
    queryFn: async () =>
      (
        await projectsApi.list({
          per_page: 6,
          sort: "updated_at",
          direction: "desc",
        })
      ).data,
  })

  const page = pageQuery.data
  usePageMeta(page)

  const heroBlock = page?.blocks.find((b) => b.type === "hero")
  const heroImage = heroBlock
    ? resolveMediaUrl(
        (heroBlock.payload.image_url as string) ??
          (heroBlock.payload.image as string) ??
          null
      )
    : null

  return {
    page,
    isLoading: pageQuery.isLoading,
    featured: featuredQuery.data ?? [],
    recent: recentQuery.data ?? [],
    heroImage,
    goSearch: (q: string) => navigate(`/search?q=${encodeURIComponent(q)}`),
    resolveMediaUrl,
  }
}
