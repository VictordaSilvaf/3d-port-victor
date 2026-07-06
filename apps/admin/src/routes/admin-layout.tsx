import { useMemo } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

import { ADMIN_NAV } from "@/models/admin/admin.model"
import { useAuth } from "@/providers/auth/auth.provider"
import { AdminShell } from "@workspace/ui/organisms/admin-shell"

export function AdminLayout() {
  const { user, logout, can } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = useMemo(
    () =>
      ADMIN_NAV.filter(
        (item) => !item.permission || can(item.permission)
      ).map((item) => ({
        id: item.id,
        label: item.label,
        href: item.href,
      })),
    [can]
  )

  const activeNavId = useMemo(() => {
    const match = ADMIN_NAV.find((item) => {
      if (item.href === "/") return location.pathname === "/"
      return location.pathname.startsWith(item.href)
    })
    return match?.id ?? "dashboard"
  }, [location.pathname])

  return (
    <AdminShell
      brand="Admin"
      navItems={navItems}
      activeNavId={activeNavId}
      onNavSelect={(href) => navigate(href)}
      userName={user?.name}
      userEmail={user?.email}
      onLogout={() => void logout().then(() => navigate("/login"))}
    >
      <Outlet />
    </AdminShell>
  )
}
