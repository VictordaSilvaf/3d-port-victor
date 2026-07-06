import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { z } from "zod"
import { toast } from "sonner"

import { authApi } from "@/lib/api/auth.api"
import { Button } from "@workspace/ui/atoms/button"
import { GlassPanel } from "@workspace/ui/molecules/glass-panel"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"

const schema = z
  .object({
    password: z.string().min(8),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Senhas não coincidem",
    path: ["password_confirmation"],
  })

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const code = params.get("code") ?? ""
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", password_confirmation: "" },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    const res = await authApi.resetPassword({
      code,
      password: values.password,
      password_confirmation: values.password_confirmation,
    })
    toast.success(res.message)
    navigate("/login")
  }

  const { register, formState: { isSubmitting } } = form

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Nova senha</h1>
      <GlassPanel>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input id="password" type="password" {...register("password")} className="border-white/20 bg-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmar</Label>
            <Input id="password_confirmation" type="password" {...register("password_confirmation")} className="border-white/20 bg-white/10" />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting || !code}>
            Redefinir senha
          </Button>
          <p className="text-center text-sm">
            <Link to="/login" className="underline">Login</Link>
          </p>
        </form>
      </GlassPanel>
    </div>
  )
}
