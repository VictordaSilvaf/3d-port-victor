import { Turnstile } from "@marsidev/react-turnstile"

import { Button } from "@workspace/ui/atoms/button"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { Textarea } from "@workspace/ui/atoms/textarea"
import { GlassPanel } from "@workspace/ui/molecules/glass-panel"

import { BlockRenderer } from "@/views/blocks/block-renderer.view"
import type { useContactViewModel } from "@/viewmodels/contact/use-contact.viewmodel"

type ContactViewProps = ReturnType<typeof useContactViewModel>

export function ContactView({
  page,
  contact,
  contactBlock,
  form,
  isLoading,
  isSubmitting,
  onSubmit,
  turnstileSiteKey,
  setTurnstileToken,
}: ContactViewProps) {
  const { register, formState: { errors } } = form

  if (isLoading) return <Skeleton className="h-96 w-full" />

  const otherBlocks =
    page?.blocks.filter((b) => b.type !== "contact_form") ?? []

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{page?.title ?? "Contacto"}</h1>
        {otherBlocks.length ? <BlockRenderer blocks={otherBlocks} /> : null}

        <GlassPanel>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              {...register("website")}
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] opacity-0"
              aria-hidden
            />
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} className="border-white/20 bg-white/10" />
              {errors.name ? <p className="text-destructive text-xs">{errors.name.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} className="border-white/20 bg-white/10" />
            </div>
            {contactBlock?.payload.show_subject ? (
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" {...register("subject")} className="border-white/20 bg-white/10" />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" rows={5} {...register("message")} className="border-white/20 bg-white/10" />
              {errors.message ? (
                <p className="text-destructive text-xs">{errors.message.message}</p>
              ) : null}
            </div>
            {turnstileSiteKey ? (
              <Turnstile siteKey={turnstileSiteKey} onSuccess={setTurnstileToken} />
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {contactBlock?.payload.submit_label ?? "Enviar mensagem"}
            </Button>
          </form>
        </GlassPanel>
      </div>

      {contact ? (
        <GlassPanel className="h-fit space-y-3 text-sm">
          <h2 className="font-semibold">Informações</h2>
          {contact.email ? <p>E-mail: {contact.email}</p> : null}
          {contact.phone ? <p>Telefone: {contact.phone}</p> : null}
          {contact.whatsapp ? (
            <a href={contact.whatsapp} className="text-orange-300 hover:underline">
              WhatsApp
            </a>
          ) : null}
          {contact.address ? (
            <p className="text-white/70">
              {[contact.address.line1, contact.address.city, contact.address.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          ) : null}
        </GlassPanel>
      ) : null}
    </div>
  )
}
