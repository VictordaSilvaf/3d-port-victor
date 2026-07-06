import {
  BoxIcon,
  CompassIcon,
  MailIcon,
  SparklesIcon,
} from "lucide-react"
import type { ReactNode } from "react"
import { useLocation, useNavigate, Outlet } from "react-router-dom"

import { buildNav, SITE_BRAND } from "@/models/site/site.model"
import { useAuth } from "@/providers/auth/auth.provider"
import { useSiteSettings } from "@/providers/site-settings/site-settings.provider"
import { GlassShell, type GlassNavItem } from "@workspace/ui/organisms/glass-shell"

const ICONS: Record<string, ReactNode> = {
  home: <CompassIcon className="size-4" />,
  projects: <BoxIcon className="size-4" />,
  experience: <SparklesIcon className="size-4" />,
  contact: <MailIcon className="size-4" />,
}

export function PublicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const settings = useSiteSettings()
  const { user, isAuthenticated, logout } = useAuth()

  const brand =
    (settings?.seo?.site_name as string | undefined)?.replace(/\s/g, "").toUpperCase() ||
    SITE_BRAND

  const navItems: GlassNavItem[] = buildNav(settings?.nav).map((item) => ({
    ...item,
    icon: ICONS[item.id] ?? <CompassIcon className="size-4" />,
  }))

  return (
    <GlassShell
      brand={brand}
      navItems={navItems}
      activeHref={location.pathname}
      backgroundImage={null}
      userName={user?.name}
      userEmail={user?.email}
      isAuthenticated={isAuthenticated}
      onNav={(href) => navigate(href)}
      onLogin={() => navigate("/login")}
      onRegister={() => navigate("/register")}
      onLogout={() => void logout()}
    >
      <Outlet />
    </GlassShell>
  )
}
