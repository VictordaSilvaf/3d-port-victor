import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, type ReactNode } from "react"

import { siteSettingsApi } from "@/lib/api/site-settings.api"
import type { SiteSettings } from "@/lib/api/types"

const SiteSettingsContext = createContext<SiteSettings | null>(null)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => (await siteSettingsApi.get()).data,
  })

  return (
    <SiteSettingsContext.Provider value={data ?? null}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
