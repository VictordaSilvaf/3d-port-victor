import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { projectsApi } from "@/lib/api/projects.api"
import { resolveMediaUrl } from "@/lib/media"
import { usePageMeta } from "@/lib/seo"

export function useProjectDetailViewModel() {
  const { slug } = useParams<{ slug: string }>()

  const projectQuery = useQuery({
    queryKey: ["projects", slug],
    queryFn: async () => (await projectsApi.bySlug(slug!)).data,
    enabled: !!slug,
  })

  const relatedQuery = useQuery({
    queryKey: ["projects", slug, "related"],
    queryFn: async () => (await projectsApi.related(slug!)).data,
    enabled: !!slug,
  })

  const project = projectQuery.data
  usePageMeta(
    project
      ? {
          id: project.id,
          title: project.title,
          slug: project.slug,
          layout: "default",
          is_home: false,
          status: project.status,
          published_at: project.published_at,
          order: project.order,
          seo: {
            title: project.title,
            description: project.description,
          },
          blocks: [],
        }
      : null
  )

  return {
    project,
    related: relatedQuery.data ?? [],
    isLoading: projectQuery.isLoading,
    resolveMediaUrl,
  }
}
