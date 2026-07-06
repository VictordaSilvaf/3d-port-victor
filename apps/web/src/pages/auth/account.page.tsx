import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { z } from "zod"
import { toast } from "sonner"

import { authApi } from "@/lib/api/auth.api"
import { useAuth } from "@/providers/auth/auth.provider"
import { Button } from "@workspace/ui/atoms/button"
import { GlassPanel } from "@workspace/ui/molecules/glass-panel"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"

const schema = z
  .object({
    current_password: z.string().min(1),
    password: z.string().min(8),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    path: ["password_confirmation"],
    message: "Senhas não coincidem",
  })

export function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  })

  if (!isLoading && !isAuthenticated) return <Navigate to="/login" replace />

  async function onSubmit(values: z.infer<typeof schema>) {
    const res = await authApi.changePassword(values)
    toast.success(res.message)
    form.reset()
  }

  const { register, formState: { isSubmitting } } = form

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Minha conta</h1>
      <GlassPanel className="space-y-2">
        <p className="font-medium">{user?.name}</p>
        <p className="text-white/70 text-sm">{user?.email}</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => void logout()}>
          Terminar sessão
        </Button>
      </GlassPanel>
      <GlassPanel>
        <h2 className="mb-4 font-semibold">Alterar senha</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Senha actual</Label>
            <Input id="current" type="password" {...register("current_password")} className="border-white/20 bg-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">Nova senha</Label>
            <Input id="new" type="password" {...register("password")} className="border-white/20 bg-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmar</Label>
            <Input id="confirm" type="password" {...register("password_confirmation")} className="border-white/20 bg-white/10" />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Actualizar senha
          </Button>
        </form>
      </GlassPanel>
    </div>
  )
}
