import { z } from "zod"

export const projectFormSchema = z.object({
  title: z.string().min(2, "Mínimo 2 caracteres").max(200),
  slug: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  repository_url: z.string().url("URL inválida").optional().or(z.literal("")),
  demo_url: z.string().url("URL inválida").optional().or(z.literal("")),
  thumbnail: z.string().optional(),
  cover: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
  categories: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>
