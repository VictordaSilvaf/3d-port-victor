export type PublishStatus = "draft" | "published" | "archived"

export type TaxonomyItem = {
  id: string
  name: string
  slug: string
}

export type PaginatedMeta = {
  total: number
  page: number
  per_page: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PaginatedMeta
}

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

export type ProjectStatistics = {
  published: number
  draft: number
  archived: number
  views: number
  featured: number
}

export type PageSeo = {
  meta_title?: string
  meta_description?: string
  og_title?: string
  og_description?: string
  og_image_id?: string | null
  canonical_url?: string | null
  robots?: string
  twitter_card?: string
}

export type PageBlock = {
  id?: string
  type: string
  order: number
  payload: Record<string, unknown>
  settings?: Record<string, unknown>
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

export type BlockType = {
  type: string
  label: string
  schema: Record<string, unknown>
}

export type SiteSettings = {
  nav: Array<{ label: string; href: string }>
  footer: Record<string, unknown>
  social: Record<string, unknown>
  branding: Record<string, unknown>
  seo: {
    site_name?: string
    default_meta_description?: string
    default_og_image_id?: string | null
    twitter_site?: string
    google_site_verification?: string | null
    locale?: string
  }
  updated_at: string
}

export type UserSummary = {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export type UserDetail = UserSummary & {
  roles: string[]
  permissions: string[]
}

export type Role = {
  id: string
  name: string
  slug: string
  is_system?: boolean
}

export type Permission = {
  id: string
  slug: string
  description: string
}

export type UploadResult = {
  id: string
  url: string
  path: string
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

export type ProjectsListParams = {
  page?: number
  per_page?: number
  search?: string
  status?: PublishStatus
  featured?: boolean
  with_trashed?: boolean
  sort?: string
  direction?: "asc" | "desc"
}

export type PagesListParams = {
  page?: number
  per_page?: number
}

export type UsersListParams = {
  page?: number
  per_page?: number
  search?: string
}
