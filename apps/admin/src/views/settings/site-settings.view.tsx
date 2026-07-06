import { Button } from "@workspace/ui/atoms/button"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { Textarea } from "@workspace/ui/atoms/textarea"
import { PageHeader } from "@workspace/ui/molecules/page-header"

import type { useSiteSettingsViewModel } from "@/viewmodels/settings/use-site-settings.viewmodel"

type SiteSettingsViewProps = ReturnType<typeof useSiteSettingsViewModel>

export function SiteSettingsView({
  form,
  isLoading,
  isSaving,
  onSubmit,
}: SiteSettingsViewProps) {
  const { register } = form

  if (isLoading) return <Skeleton className="h-96 w-full" />

  return (
    <>
      <PageHeader
        title="Configurações do site"
        description="Nav, branding e SEO global."
        actions={
          <Button onClick={onSubmit} disabled={isSaving}>
            {isSaving ? "A guardar…" : "Guardar"}
          </Button>
        }
      />

      <form onSubmit={onSubmit} className="grid max-w-2xl gap-6">
        <div className="space-y-2">
          <Label htmlFor="site_name">Nome do site</Label>
          <Input id="site_name" {...register("seo.site_name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="default_meta_description">Meta description padrão</Label>
          <Textarea
            id="default_meta_description"
            rows={3}
            {...register("seo.default_meta_description")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter_site">Twitter @site</Label>
          <Input id="twitter_site" {...register("seo.twitter_site")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="locale">Locale</Label>
          <Input id="locale" placeholder="pt_BR" {...register("seo.locale")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo_upload_id">Logo upload ID</Label>
          <Input id="logo_upload_id" {...register("branding.logo_upload_id" as "branding")} />
        </div>
      </form>
    </>
  )
}
