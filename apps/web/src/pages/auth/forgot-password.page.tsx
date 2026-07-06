import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"

import { authApi } from "@/lib/api/auth.api"
import { Button } from "@workspace/ui/atoms/button"
import { GlassPanel } from "@workspace/ui/molecules/glass-panel"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"

const schema = z.object({ email: z.string().email() })

export function ForgotPasswordPage() {
  const [done, setDone] = useState(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    const res = await authApi.forgotPassword(values.email)
    toast.success(res.message)
    setDone(true)
  }

  const { register, formState: { isSubmitting } } = form

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Recuperar senha</h1>
      <GlassPanel>
        {done ? (
          <p className="text-sm text-white/80">Verifique o seu e-mail.</p>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} className="border-white/20 bg-white/10" />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Enviar instruções
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="underline">Voltar ao login</Link>
        </p>
      </GlassPanel>
    </div>
  )
}
