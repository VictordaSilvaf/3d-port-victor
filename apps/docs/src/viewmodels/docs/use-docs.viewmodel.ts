import { useCallback, useMemo, useState } from "react"

import { DOCS_MODEL } from "@/models/docs/docs.model"

export function useDocsViewModel() {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    DOCS_MODEL.navItems[0].id
  )

  const activeSection = useMemo(
    () =>
      DOCS_MODEL.sections.find((section) => section.id === activeSectionId) ??
      DOCS_MODEL.sections[0],
    [activeSectionId]
  )

  const selectSection = useCallback((id: string) => {
    setActiveSectionId(id)
  }, [])

  return {
    brand: DOCS_MODEL.brand,
    title: DOCS_MODEL.title,
    subtitle: DOCS_MODEL.subtitle,
    navItems: DOCS_MODEL.navItems,
    activeSectionId,
    activeSection,
    selectSection,
  }
}

export type DocsViewModel = ReturnType<typeof useDocsViewModel>
