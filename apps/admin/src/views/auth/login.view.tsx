import { Button } from "@workspace/ui/atoms/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/atoms/card"
import { Input } from "@workspace/ui/atoms/input"
import { Label } from "@workspace/ui/atoms/label"
import { CenteredContentTemplate } from "@workspace/ui/templates/centered-content"

import type { useLoginViewModel } from "@/viewmodels/auth/use-login.viewmodel"

type LoginViewProps = ReturnType<typeof useLoginViewModel>

export function LoginView({ form, onSubmit, error, isSubmitting }: LoginViewProps) {
  const { register, formState: { errors } } = form

  return (
    <CenteredContentTemplate>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Entrar no Admin</CardTitle>
          <CardDescription>
            Use as suas credenciais para aceder ao painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error ? (
              <p className="text-destructive text-sm">{error}</p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-destructive text-xs">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-destructive text-xs">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "A entrar…" : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </CenteredContentTemplate>
  )
}
