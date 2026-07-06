import type { PublishStatus } from "@/lib/api/types"

export const ADMIN_NAV = [
  { id: "dashboard", label: "Visão geral", href: "/", permission: null },
  {
    id: "projects",
    label: "Projetos",
    href: "/projects",
    permission: "projects.view",
  },
  { id: "pages", label: "Páginas", href: "/pages", permission: "pages.view" },
  { id: "users", label: "Utilizadores", href: "/users", permission: "users.view" },
  { id: "roles", label: "Roles", href: "/roles", permission: "roles.view" },
  {
    id: "settings",
    label: "Site",
    href: "/settings",
    permission: "site.update",
  },
] as const

export const STATUS_LABELS: Record<PublishStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export function formatDate(value: string | null): string {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
