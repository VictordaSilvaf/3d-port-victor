import type { GlassNavItem } from "@workspace/ui/organisms/glass-shell"

export const FIXED_NAV: Omit<GlassNavItem, "icon">[] = [
  { id: "home", label: "Início", href: "/" },
  { id: "projects", label: "Projetos", href: "/projects" },
  { id: "experience", label: "Experiência 3D", href: "/experiencia" },
  { id: "contact", label: "Contacto", href: "/contato" },
]

export function buildNav(
  cmsNav?: Array<{ label: string; href: string }>
): Omit<GlassNavItem, "icon">[] {
  const items = [...FIXED_NAV]
  if (!cmsNav?.length) return items

  for (const item of cmsNav) {
    const href = item.href.startsWith("/") ? item.href : `/p/${item.href}`
    if (items.some((n) => n.href === href)) continue
    items.push({
      id: `cms-${item.href}`,
      label: item.label,
      href,
    })
  }
  return items
}

export const SITE_BRAND = "VICTOR"
