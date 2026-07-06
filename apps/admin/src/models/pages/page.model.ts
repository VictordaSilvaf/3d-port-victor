import { z } from "zod"

export const pageFormSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().optional(),
  layout: z.enum(["default", "full-width", "landing"]).optional(),
  is_home: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  seo: z
    .object({
      meta_title: z.string().optional(),
      meta_description: z.string().optional(),
      og_title: z.string().optional(),
      og_description: z.string().optional(),
      robots: z.string().optional(),
      twitter_card: z.string().optional(),
    })
    .optional(),
})

export type PageFormValues = z.infer<typeof pageFormSchema>

export const BLOCK_TYPES = [
  "hero",
  "markdown",
  "image",
  "gallery",
  "featured_projects",
  "project_list",
  "tech_stack",
  "cta",
  "embed",
  "spacer",
] as const

export type BlockTypeName = (typeof BLOCK_TYPES)[number]

export const BLOCK_LABELS: Record<BlockTypeName, string> = {
  hero: "Hero",
  markdown: "Markdown",
  image: "Imagem",
  gallery: "Galeria",
  featured_projects: "Projetos em destaque",
  project_list: "Lista de projetos",
  tech_stack: "Stack tecnológica",
  cta: "CTA",
  embed: "Embed",
  spacer: "Espaçador",
}

export function defaultBlockPayload(type: BlockTypeName): Record<string, unknown> {
  switch (type) {
    case "hero":
      return { headline: "", subheadline: "" }
    case "markdown":
      return { content: "" }
    case "image":
      return { image_id: "", caption: "" }
    case "gallery":
      return { image_ids: [] }
    case "featured_projects":
      return { project_ids: [] }
    case "project_list":
      return { limit: 6 }
    case "tech_stack":
      return { technology_ids: [] }
    case "cta":
      return { label: "", href: "" }
    case "embed":
      return { url: "" }
    case "spacer":
      return { size: "md" }
    default:
      return {}
  }
}
