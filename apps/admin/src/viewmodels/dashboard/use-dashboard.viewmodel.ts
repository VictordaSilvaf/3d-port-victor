import { useCallback, useMemo, useState } from "react"

import {
  DASHBOARD_MODEL,
  type DashboardSectionId,
} from "@/models/dashboard/dashboard.model"

export function useDashboardViewModel() {
  const [activeSectionId, setActiveSectionId] = useState<DashboardSectionId>(
    "overview"
  )

  const activeSection = useMemo(
    () => DASHBOARD_MODEL.sections[activeSectionId],
    [activeSectionId]
  )

  const selectSection = useCallback((id: string) => {
    if (id in DASHBOARD_MODEL.sections) {
      setActiveSectionId(id as DashboardSectionId)
    }
  }, [])

  return {
    brand: DASHBOARD_MODEL.brand,
    title: DASHBOARD_MODEL.title,
    subtitle: DASHBOARD_MODEL.subtitle,
    navItems: DASHBOARD_MODEL.navItems,
    activeSectionId,
    activeSection,
    selectSection,
  }
}

export type DashboardViewModel = ReturnType<typeof useDashboardViewModel>
