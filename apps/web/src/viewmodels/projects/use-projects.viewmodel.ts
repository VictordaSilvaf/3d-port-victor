import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

import { projectsApi } from "@/lib/api/projects.api"
import { resolveMediaUrl } from "@/lib/media"

export function useProjectsViewModel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const page = Number(searchParams.get("page") ?? 1)

  const listQuery = useQuery({
    queryKey: ["projects", "list", page, search],
    queryFn: () =>
      projectsApi.list({
        page,
        per_page: 12,
        search: search || undefined,
      }),
  })

  function setPage(p: number) {
    const next = new URLSearchParams(searchParams)
    next.set("page", String(p))
    setSearchParams(next)
  }

  function applySearch() {
    const next = new URLSearchParams()
    if (search) next.set("search", search)
    setSearchParams(next)
  }

  return {
    projects: listQuery.data?.data ?? [],
    meta: listQuery.data?.meta ?? { total: 0, page: 1, per_page: 12 },
    isLoading: listQuery.isLoading,
    search,
    setSearch,
    applySearch,
    page,
    setPage,
    resolveMediaUrl,
  }
}
