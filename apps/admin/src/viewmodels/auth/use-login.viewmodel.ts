import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"

import { useAuth } from "@/providers/auth/auth.provider"
import type { ApiError } from "@/lib/api/types"

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function useLoginViewModel() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/"

  async function onSubmit(values: LoginFormValues) {
    setError(null)
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (err) {
      const apiErr = err as ApiError
      setError(
        apiErr.status === 401
          ? "Credenciais inválidas."
          : apiErr.message ?? "Erro ao entrar."
      )
    }
  }

  return { form, onSubmit: form.handleSubmit(onSubmit), error, isSubmitting: form.formState.isSubmitting }
}
