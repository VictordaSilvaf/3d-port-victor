import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react"

import { Button } from "@workspace/ui/atoms/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/atoms/card"
import { Checkbox } from "@workspace/ui/atoms/checkbox"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/atoms/select"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { Textarea } from "@workspace/ui/atoms/textarea"
import { PageHeader } from "@workspace/ui/molecules/page-header"

import type { BlockTypeName } from "@/models/pages/page.model"
import type { usePageFormViewModel } from "@/viewmodels/pages/use-page-form.viewmodel"

type PageFormViewProps = ReturnType<typeof usePageFormViewModel>

function BlockEditor({
  type,
  payload,
  onChange,
}: {
  type: string
  payload: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
}) {
  const fields: Array<{ key: string; label: string; multiline?: boolean }> = []

  switch (type) {
    case "hero":
      fields.push(
        { key: "headline", label: "Headline" },
        { key: "subheadline", label: "Subheadline" },
        { key: "image_id", label: "Image ID (upload)" }
      )
      break
    case "markdown":
      fields.push({ key: "content", label: "Conteúdo", multiline: true })
      break
    case "image":
      fields.push(
        { key: "image_id", label: "Image ID" },
        { key: "caption", label: "Legenda" }
      )
      break
    case "cta":
      fields.push({ key: "label", label: "Label" }, { key: "href", label: "Href" })
      break
    case "embed":
      fields.push({ key: "url", label: "URL" })
      break
    case "spacer":
      fields.push({ key: "size", label: "Tamanho (sm/md/lg)" })
      break
    default:
      fields.push({ key: "data", label: "Payload JSON", multiline: true })
  }

  return (
    <div className="space-y-3">
      {fields.map((field) =>
        field.multiline ? (
          <div key={field.key} className="space-y-1">
            <Label>{field.label}</Label>
            <Textarea
              rows={4}
              value={String(payload[field.key] ?? "")}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          </div>
        ) : (
          <div key={field.key} className="space-y-1">
            <Label>{field.label}</Label>
            <Input
              value={String(payload[field.key] ?? "")}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          </div>
        )
      )}
    </div>
  )
}

export function PageFormView({
  form,
  isNew,
  isLoading,
  isSaving,
  onSubmit,
  blocks,
  addBlock,
  updateBlockPayload,
  removeBlock,
  moveBlock,
  saveBlocks,
  isSavingBlocks,
  publish,
  canPublish,
  blockTypes,
  blockLabels,
  goBack,
}: PageFormViewProps) {
  const { register, watch, setValue, formState: { errors } } = form
  const isHome = watch("is_home")

  if (!isNew && isLoading) return <Skeleton className="h-96 w-full" />

  return (
    <>
      <PageHeader
        title={isNew ? "Nova página" : "Editar página"}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon data-icon="inline-start" />
              Voltar
            </Button>
            {canPublish && !isNew ? (
              <Button variant="secondary" onClick={publish}>
                Publicar
              </Button>
            ) : null}
            {!isNew ? (
              <Button variant="outline" onClick={saveBlocks} disabled={isSavingBlocks}>
                Guardar blocos
              </Button>
            ) : null}
            <Button onClick={onSubmit} disabled={isSaving}>
              {isSaving ? "A guardar…" : "Guardar"}
            </Button>
          </div>
        }
      />

      <form onSubmit={onSubmit} className="mb-8 grid max-w-3xl gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input id="title" {...register("title")} />
          {errors.title ? (
            <p className="text-destructive text-xs">{errors.title.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Layout</Label>
            <Select
              value={watch("layout") ?? "default"}
              onValueChange={(v) =>
                setValue("layout", v as "default" | "full-width" | "landing")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="full-width">Full width</SelectItem>
                <SelectItem value="landing">Landing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="is_home"
              checked={isHome}
              onCheckedChange={(v) => setValue("is_home", !!v)}
            />
            <Label htmlFor="is_home">Página inicial</Label>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_title">SEO — Meta title</Label>
          <Input id="meta_title" {...register("seo.meta_title")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_description">SEO — Meta description</Label>
          <Textarea id="meta_description" rows={2} {...register("seo.meta_description")} />
        </div>
      </form>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Blocos</h2>
          <Select onValueChange={(v) => addBlock(v as BlockTypeName)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Adicionar bloco" />
            </SelectTrigger>
            <SelectContent>
              {blockTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {blockLabels[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {blocks.map((block, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">
                  {blockLabels[block.type as BlockTypeName] ?? block.type}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => moveBlock(index, -1)}
                  >
                    <ChevronUpIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => moveBlock(index, 1)}
                  >
                    <ChevronDownIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeBlock(index)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <BlockEditor
                  type={block.type}
                  payload={block.payload}
                  onChange={(key, value) => updateBlockPayload(index, key, value)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
