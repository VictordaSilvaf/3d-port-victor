import { MenuIcon } from "lucide-react"
import { useState, type ReactNode } from "react"

import { Button } from "@workspace/ui/atoms/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/atoms/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/atoms/sheet"
import { cn } from "@workspace/ui/lib/utils"

export type AdminNavItem = {
  id: string
  label: string
  href: string
}

type AdminShellProps = {
  brand: string
  navItems: readonly AdminNavItem[]
  activeNavId: string
  onNavSelect: (href: string) => void
  userName?: string
  userEmail?: string
  onLogout?: () => void
  children: ReactNode
}

function NavList({
  navItems,
  activeNavId,
  onNavSelect,
}: {
  navItems: readonly AdminNavItem[]
  activeNavId: string
  onNavSelect: (href: string) => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onNavSelect(item.href)}
          className={cn(
            "rounded-xl px-3 py-2 text-left text-sm transition-colors",
            activeNavId === item.id
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

export function AdminShell({
  brand,
  navItems,
  activeNavId,
  onNavSelect,
  userName,
  userEmail,
  onLogout,
  children,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleNav(href: string) {
    onNavSelect(href)
    setMobileOpen(false)
  }

  return (
    <div className="flex min-h-svh">
      <aside className="border-border hidden w-56 shrink-0 border-r p-4 md:flex md:flex-col">
        <p className="mb-6 text-sm font-semibold">{brand}</p>
        <NavList
          navItems={navItems}
          activeNavId={activeNavId}
          onNavSelect={handleNav}
        />
        <div className="mt-auto pt-6">
          {userName ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hover:bg-muted w-full rounded-xl px-3 py-2 text-left text-sm transition-colors"
                >
                  <p className="truncate font-medium">{userName}</p>
                  {userEmail ? (
                    <p className="text-muted-foreground truncate text-xs">
                      {userEmail}
                    </p>
                  ) : null}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {onLogout ? (
                  <>
                    <DropdownMenuItem onClick={onLogout}>
                      Terminar sessão
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border flex items-center gap-3 border-b p-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>{brand}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <NavList
                  navItems={navItems}
                  activeNavId={activeNavId}
                  onNavSelect={handleNav}
                />
              </div>
              {onLogout ? (
                <Button
                  variant="ghost"
                  className="mt-6 w-full justify-start"
                  onClick={onLogout}
                >
                  Terminar sessão
                </Button>
              ) : null}
            </SheetContent>
          </Sheet>
          <p className="text-sm font-semibold">{brand}</p>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
