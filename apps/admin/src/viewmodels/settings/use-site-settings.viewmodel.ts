import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { siteSettingsApi } from "@/lib/api/uploads.api"
import type { SiteSettings } from "@/lib/api/types"

export function useSiteSettingsViewModel() {
  const queryClient = useQueryClient()

  const settingsQuery = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => (await siteSettingsApi.get()).data,
  })

  const form = useForm<Partial<SiteSettings>>({
    defaultValues: {
      nav: [],
      seo: {},
      branding: {},
      social: {},
      footer: {},
    },
  })

  useEffect(() => {
    if (settingsQuery.data) {
      form.reset(settingsQuery.data)
    }
  }, [settingsQuery.data, form])

  const saveMutation = useMutation({
    mutationFn: (values: Partial<SiteSettings>) => siteSettingsApi.update(values),
    onSuccess: () => {
      toast.success("Configurações guardadas.")
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] })
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro."),
  })

  return {
    form,
    isLoading: settingsQuery.isLoading,
    isSaving: saveMutation.isPending,
    onSubmit: form.handleSubmit((v) => saveMutation.mutate(v)),
  }
}
