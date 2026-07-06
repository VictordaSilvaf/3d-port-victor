import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { contactApi } from "@/lib/api/contact.api"
import { pagesApi } from "@/lib/api/pages.api"
import type { ContactFormBlock } from "@/lib/api/types"
import { usePageMeta } from "@/lib/seo"
import { useSiteSettings } from "@/providers/site-settings/site-settings.provider"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
  website: z.literal("").optional(),
})

export function useContactViewModel() {
  const settings = useSiteSettings()
  const [turnstileToken, setTurnstileToken] = useState("")

  const pageQuery = useQuery({
    queryKey: ["pages", "contato"],
    queryFn: async () => (await pagesApi.bySlug("contato")).data,
  })

  const page = pageQuery.data
  usePageMeta(page)

  const contactBlock = page?.blocks.find(
    (b) => b.type === "contact_form"
  ) as ContactFormBlock | undefined

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) =>
      contactApi.submit({
        name: values.name,
        email: values.email,
        subject: contactBlock?.payload.show_subject ? values.subject : null,
        message: values.message,
        cf_turnstile_response: turnstileToken || undefined,
      }),
    onSuccess: (data) => {
      toast.success(
        contactBlock?.payload.success_message ?? data.message ?? "Mensagem enviada."
      )
      form.reset()
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? "Erro ao enviar."),
  })

  return {
    page,
    contact: settings?.contact,
    contactBlock,
    form,
    isLoading: pageQuery.isLoading,
    isSubmitting: mutation.isPending,
    onSubmit: form.handleSubmit((v) => mutation.mutate(v)),
    turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
    setTurnstileToken,
  }
}
