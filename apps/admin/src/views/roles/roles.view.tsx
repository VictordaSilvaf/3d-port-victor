import { Button } from "@workspace/ui/atoms/button"
import { Checkbox } from "@workspace/ui/atoms/checkbox"
import { Input } from "@workspace/ui/atoms/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/atoms/select"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import { PageHeader } from "@workspace/ui/molecules/page-header"

import type { useRolesViewModel } from "@/viewmodels/roles/use-roles.viewmodel"

type RolesViewProps = ReturnType<typeof useRolesViewModel>

export function RolesView({
  roles,
  permissions,
  isLoading,
  newRoleName,
  setNewRoleName,
  newRoleSlug,
  setNewRoleSlug,
  createRole,
  isCreating,
  deleteRole,
  selectedRoleId,
  setSelectedRoleId,
  selectedPermissions,
  togglePermission,
  savePermissions,
  isSavingPermissions,
  canCreate,
  canDelete,
  canAssign,
}: RolesViewProps) {
  if (isLoading) return <Skeleton className="h-48 w-full" />

  return (
    <>
      <PageHeader title="Roles & Permissões" description="Configurar RBAC do sistema." />

      {canCreate ? (
        <section className="mb-8 grid max-w-md gap-3">
          <h2 className="text-sm font-medium">Nova role</h2>
          <Input
            placeholder="Nome"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <Input
            placeholder="Slug"
            value={newRoleSlug}
            onChange={(e) => setNewRoleSlug(e.target.value)}
          />
          <Button onClick={createRole} disabled={isCreating}>
            Criar role
          </Button>
        </section>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium">Roles existentes</h2>
        <ul className="space-y-2">
          {roles.map((role) => (
            <li key={role.id} className="flex items-center justify-between gap-2 text-sm">
              <button
                type="button"
                className="hover:underline"
                onClick={() => setSelectedRoleId(role.id)}
              >
                {role.name} ({role.slug})
              </button>
              {canDelete && !role.is_system ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => deleteRole(role.id)}
                >
                  Eliminar
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {canAssign ? (
        <section className="space-y-4">
          <h2 className="text-sm font-medium">Permissões da role</h2>
          <Select value={selectedRoleId ?? ""} onValueChange={setSelectedRoleId}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Seleccionar role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRoleId ? (
            <>
              <div className="grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">
                {permissions.map((p) => (
                  <label key={p.id} className="flex items-start gap-2 text-sm">
                    <Checkbox
                      checked={selectedPermissions.includes(p.id)}
                      onCheckedChange={() => togglePermission(p.id)}
                    />
                    <span>
                      <span className="font-medium">{p.slug}</span>
                      <span className="text-muted-foreground block text-xs">
                        {p.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <Button onClick={savePermissions} disabled={isSavingPermissions}>
                Guardar permissões
              </Button>
            </>
          ) : null}
        </section>
      ) : null}
    </>
  )
}
