import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"

import { useAuth } from "@/providers/auth/auth.provider"
import type { ApiError } from "@/lib/api/types"
import { Button } from "@workspace/ui/atoms/button"
import { GlassPanel } from "@workspace/ui/molecules/glass-panel"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"
import { useState } from "react"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export function useLoginViewModel() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/"

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null)
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (err) {
      const e = err as ApiError
      setError(e.status === 401 ? "Credenciais inválidas." : e.message)
    }
  }

  return { form, onSubmit: form.handleSubmit(onSubmit), error, isSubmitting: form.formState.isSubmitting }
}

export function LoginView({ form, onSubmit, error, isSubmitting }: ReturnType<typeof useLoginViewModel>) {
  const { register, formState: { errors } } = form
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Entrar</h1>
      <GlassPanel>
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register("email")} className="border-white/20 bg-white/10" />
            {errors.email ? <p className="text-destructive text-xs">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register("password")} className="border-white/20 bg-white/10" />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "A entrar…" : "Entrar"}
          </Button>
          <p className="text-center text-sm text-white/70">
            <Link to="/register" className="underline">Criar conta</Link>
            {" · "}
            <Link to="/forgot-password" className="underline">Esqueci a senha</Link>
          </p>
        </form>
      </GlassPanel>
    </div>
  )
}

export function LoginPage() {
  return <LoginView {...useLoginViewModel()} />
}
