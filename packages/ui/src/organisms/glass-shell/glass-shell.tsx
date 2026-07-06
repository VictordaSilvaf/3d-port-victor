import {
  BoxIcon,
  CompassIcon,
  LogInIcon,
  MailIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react"
import { useState, type ReactNode } from "react"

import { Button } from "@workspace/ui/atoms/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/atoms/sheet"
import { GlassPanel } from "@workspace/ui/molecules/glass-panel"
import { cn } from "@workspace/ui/lib/utils"

export type GlassNavItem = {
  id: string
  label: string
  href: string
  icon?: ReactNode
}

type GlassShellProps = {
  brand: string
  navItems: readonly GlassNavItem[]
  activeHref: string
  backgroundImage?: string | null
  userName?: string
  userEmail?: string
  isAuthenticated?: boolean
  onNav: (href: string) => void
  onLogin?: () => void
  onRegister?: () => void
  onLogout?: () => void
  children: ReactNode
}

function NavButton({
  item,
  active,
  onNav,
}: {
  item: GlassNavItem
  active: boolean
  onNav: (href: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onNav(item.href)}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors",
        active
          ? "bg-white/20 font-medium text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      {item.icon}
      {item.label}
    </button>
  )
}

export function GlassShell({
  brand,
  navItems,
  activeHref,
  backgroundImage,
  userName,
  isAuthenticated,
  onNav,
  onLogin,
  onRegister,
  onLogout,
  children,
}: GlassShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleNav(href: string) {
    onNav(href)
    setMobileOpen(false)
  }

  const sidebar = (
    <div className="flex h-full flex-col p-4">
      <p className="mb-8 text-lg font-bold tracking-wide text-white">
        <span className="text-orange-400">{brand.slice(0, 2)}</span>
        <span>{brand.slice(2)}</span>
      </p>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={activeHref === item.href || activeHref.startsWith(item.href + "/")}
            onNav={handleNav}
          />
        ))}
      </nav>
      <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
        {isAuthenticated && userName ? (
          <div className="flex items-center gap-2 px-2 text-sm text-white">
            <UserIcon className="size-4" />
            <span className="truncate">{userName}</span>
          </div>
        ) : null}
        <div className="flex flex-col gap-1">
          {isAuthenticated ? (
            <>
              <NavButton
                item={{ id: "account", label: "Conta", href: "/account", icon: <UserIcon className="size-4" /> }}
                active={activeHref === "/account"}
                onNav={handleNav}
              />
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-2xl px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10"
                >
                  Sair
                </button>
              ) : null}
            </>
          ) : (
            <>
              {onLogin ? (
                <button
                  type="button"
                  onClick={onLogin}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  <LogInIcon className="size-4" /> Entrar
                </button>
              ) : null}
              {onRegister ? (
                <button
                  type="button"
                  onClick={onRegister}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  <UserIcon className="size-4" /> Registar
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : "linear-gradient(135deg, oklch(0.45 0.08 50), oklch(0.35 0.06 280))",
        }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 flex min-h-svh">
        <aside className="hidden w-56 shrink-0 md:block">
          <GlassPanel className="m-4 h-[calc(100svh-2rem)] border-white/20 bg-black/25 p-0 backdrop-blur-xl">
            {sidebar}
          </GlassPanel>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 p-4 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="border-white/20 bg-black/30 text-white">
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-white/20 bg-black/80 p-0 text-white backdrop-blur-xl">
                <SheetHeader className="sr-only">
                  <SheetTitle>{brand}</SheetTitle>
                </SheetHeader>
                {sidebar}
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-white">{brand}</span>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 md:pl-0">
            <GlassPanel className="min-h-[calc(100svh-8rem)] border-white/20 bg-black/25 text-white backdrop-blur-xl md:min-h-[calc(100svh-3rem)]">
              {children}
            </GlassPanel>
          </main>
        </div>
      </div>
    </div>
  )
}

export const defaultNavIcons = {
  home: <CompassIcon className="size-4" />,
  projects: <BoxIcon className="size-4" />,
  search: <SearchIcon className="size-4" />,
  contact: <MailIcon className="size-4" />,
}
