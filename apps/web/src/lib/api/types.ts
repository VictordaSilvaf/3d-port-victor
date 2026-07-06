export type PublishStatus = "draft" | "published" | "archived"

export type TaxonomyItem = { id: string; name: string; slug: string }

export type PaginatedMeta = { total: number; page: number; per_page: number }

export type PaginatedResponse<T> = { data: T[]; meta: PaginatedMeta }

export type ProjectImage = {
  id: string
  upload_id: string
  caption: string | null
  order: number
  url: string
  path: string
}

export type ProjectSummary = {
  id: string
  title: string
  slug: string
  description: string
  status: PublishStatus
  featured: boolean
  sort_order: number
  order: number
  thumbnail: string | null
  cover: string | null
  published_at: string | null
  views: number
  created_at: string
  updated_at: string
}

export type ProjectDetail = ProjectSummary & {
  content: string
  repository_url: string | null
  demo_url: string | null
  categories: TaxonomyItem[]
  technologies: TaxonomyItem[]
  tags: TaxonomyItem[]
  images: ProjectImage[]
}

export type PageBlock = {
  id?: string
  type: string
  order: number
  payload: Record<string, unknown>
  settings?: Record<string, unknown>
}

export type PageSeo = {
  title?: string
  description?: string
  canonical?: string
  open_graph?: Record<string, string>
  twitter?: Record<string, string>
}

export type PageDetail = {
  id: string
  title: string
  slug: string
  layout: string
  is_home: boolean
  status: PublishStatus
  published_at: string | null
  order: number
  seo: PageSeo
  blocks: PageBlock[]
}

export type PageSummary = {
  id: string
  title: string
  slug: string
  status: PublishStatus
  is_home: boolean
  sort_order: number
  published_at: string | null
}

export type SiteContact = {
  email?: string
  phone?: string
  whatsapp?: string
  address?: {
    line1?: string
    city?: string
    country?: string
  }
  notification_email?: string | null
}

export type SiteSettings = {
  nav: Array<{ label: string; href: string }>
  footer: Record<string, unknown>
  social: Record<string, unknown>
  branding: Record<string, unknown>
  contact?: SiteContact
  seo: {
    site_name?: string
    default_meta_description?: string
    default_og_image_id?: string | null
    twitter_site?: string
    locale?: string
  }
  updated_at: string
}

export type LoginResponse = {
  access_token: string
  token_type: string
  roles: string[]
  permissions: string[]
}

export type ApiError = {
  message: string
  errors?: Record<string, string[]>
  status: number
}

export type ContactFormBlock = {
  type: "contact_form"
  payload: {
    title?: string
    subtitle?: string | null
    submit_label?: string
    success_message?: string
    show_subject?: boolean
  }
}

export type ProjectsListParams = {
  page?: number
  per_page?: number
  search?: string
  technology?: string
  category?: string
  tag?: string
  featured?: boolean
  sort?: string
  direction?: "asc" | "desc"
}
