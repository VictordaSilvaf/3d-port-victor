import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { useState } from "react"

import { useAuth } from "@/providers/auth/auth.provider"
import type { ApiError } from "@/lib/api/types"
import { Button } from "@workspace/ui/atoms/button"
import { GlassPanel } from "@workspace/ui/molecules/glass-panel"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[a-z]/, "Mínimo 1 minúscula")
      .regex(/[A-Z]/, "Mínimo 1 maiúscula")
      .regex(/\d/, "Mínimo 1 dígito"),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Senhas não coincidem",
    path: ["password_confirmation"],
  })

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setError(null)
    try {
      await registerUser(values)
      navigate("/", { replace: true })
    } catch (err) {
      setError((err as ApiError).message)
    }
  }

  const { register, formState: { errors, isSubmitting } } = form

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <GlassPanel>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} className="border-white/20 bg-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register("email")} className="border-white/20 bg-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register("password")} className="border-white/20 bg-white/10" />
            {errors.password ? <p className="text-destructive text-xs">{errors.password.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmar senha</Label>
            <Input id="password_confirmation" type="password" {...register("password_confirmation")} className="border-white/20 bg-white/10" />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Registar
          </Button>
          <p className="text-center text-sm text-white/70">
            <Link to="/login" className="underline">Já tenho conta</Link>
          </p>
        </form>
      </GlassPanel>
    </div>
  )
}
