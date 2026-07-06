import { Button } from "@workspace/ui/atoms/button"
import { Checkbox } from "@workspace/ui/atoms/checkbox"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { PageHeader } from "@workspace/ui/molecules/page-header"

import type { useUserDetailViewModel } from "@/viewmodels/users/use-users.viewmodel"

type UserDetailViewProps = ReturnType<typeof useUserDetailViewModel>

export function UserDetailView({
  user,
  roles,
  isLoading,
  selectedRoles,
  toggleRole,
  saveRoles,
  isSaving,
  canAssign,
}: UserDetailViewProps) {
  if (isLoading) return <Skeleton className="h-48 w-full" />
  if (!user) return <p className="text-muted-foreground text-sm">Utilizador não encontrado.</p>

  return (
    <>
      <PageHeader
        title={user.name}
        description={user.email}
        actions={
          canAssign ? (
            <Button onClick={saveRoles} disabled={isSaving}>
              {isSaving ? "A guardar…" : "Guardar roles"}
            </Button>
          ) : null
        }
      />

      <section className="mb-8">
        <h2 className="mb-2 text-sm font-medium">Permissões actuais</h2>
        <p className="text-muted-foreground text-sm">
          {user.permissions.length ? user.permissions.join(", ") : "Nenhuma"}
        </p>
      </section>

      {canAssign ? (
        <section className="space-y-3">
          <h2 className="text-sm font-medium">Roles</h2>
          {roles.map((role) => (
            <label key={role.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedRoles.includes(role.id)}
                onCheckedChange={() => toggleRole(role.id)}
              />
              <span>{role.name}</span>
              <span className="text-muted-foreground">({role.slug})</span>
            </label>
          ))}
        </section>
      ) : null}
    </>
  )
}
