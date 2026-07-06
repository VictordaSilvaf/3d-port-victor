import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@workspace/ui/atoms/button"
import { Checkbox } from "@workspace/ui/atoms/checkbox"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { Textarea } from "@workspace/ui/atoms/textarea"
import { FileUpload } from "@workspace/ui/molecules/file-upload"
import { PageHeader } from "@workspace/ui/molecules/page-header"
import { StatusBadge } from "@workspace/ui/molecules/status-badge"

import type { useProjectFormViewModel } from "@/viewmodels/projects/use-project-form.viewmodel"

type ProjectFormViewProps = ReturnType<typeof useProjectFormViewModel>

export function ProjectFormView({
  form,
  isNew,
  isLoading,
  isSaving,
  onSubmit,
  taxonomies,
  project,
  publish,
  archive,
  draft,
  canPublish,
  uploadThumbnail,
  uploadCover,
  goBack,
}: ProjectFormViewProps) {
  const { register, watch, setValue, formState: { errors } } = form
  const featured = watch("featured")
  const categories = watch("categories") ?? []
  const technologies = watch("technologies") ?? []
  const tags = watch("tags") ?? []

  if (!isNew && isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  function toggleId(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  }

  return (
    <>
      <PageHeader
        title={isNew ? "Novo projeto" : "Editar projeto"}
        description={project ? `/${project.slug}` : undefined}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon data-icon="inline-start" />
              Voltar
            </Button>
            {canPublish && !isNew && project?.status !== "published" ? (
              <Button variant="secondary" onClick={publish}>
                Publicar
              </Button>
            ) : null}
            {canPublish && !isNew && project?.status === "published" ? (
              <Button variant="secondary" onClick={archive}>
                Arquivar
              </Button>
            ) : null}
            {canPublish && !isNew && project?.status !== "draft" ? (
              <Button variant="outline" onClick={draft}>
                Rascunho
              </Button>
            ) : null}
            <Button onClick={onSubmit} disabled={isSaving}>
              {isSaving ? "A guardar…" : "Guardar"}
            </Button>
          </div>
        }
      />

      {project ? (
        <div className="mb-6">
          <StatusBadge status={project.status} />
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid max-w-3xl gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input id="title" {...register("title")} />
          {errors.title ? (
            <p className="text-destructive text-xs">{errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" placeholder="auto-gerado se vazio" {...register("slug")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo (Markdown)</Label>
          <Textarea id="content" rows={8} {...register("content")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="repository_url">Repositório</Label>
            <Input id="repository_url" {...register("repository_url")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo_url">Demo</Label>
            <Input id="demo_url" {...register("demo_url")} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={(v) => setValue("featured", !!v)}
          />
          <Label htmlFor="featured">Destaque</Label>
        </div>

        {taxonomies ? (
          <div className="grid gap-6 sm:grid-cols-3">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Categorias</legend>
              {taxonomies.categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={categories.includes(c.id)}
                    onCheckedChange={() =>
                      setValue("categories", toggleId(categories, c.id))
                    }
                  />
                  {c.name}
                </label>
              ))}
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Tecnologias</legend>
              {taxonomies.technologies.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={technologies.includes(t.id)}
                    onCheckedChange={() =>
                      setValue("technologies", toggleId(technologies, t.id))
                    }
                  />
                  {t.name}
                </label>
              ))}
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Tags</legend>
              {taxonomies.tags.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={tags.includes(t.id)}
                    onCheckedChange={() =>
                      setValue("tags", toggleId(tags, t.id))
                    }
                  />
                  {t.name}
                </label>
              ))}
            </fieldset>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <FileUpload onUpload={uploadThumbnail} accept="image/*" />
            {watch("thumbnail") ? (
              <p className="text-muted-foreground text-xs">{watch("thumbnail")}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Cover</Label>
            <FileUpload onUpload={uploadCover} accept="image/*" />
            {watch("cover") ? (
              <p className="text-muted-foreground text-xs">{watch("cover")}</p>
            ) : null}
          </div>
        </div>
      </form>
    </>
  )
}
