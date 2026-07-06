import { Navigate } from "react-router-dom"

import { useAuth } from "@/providers/auth/auth.provider"
import { useLoginViewModel } from "@/viewmodels/auth/use-login.viewmodel"
import { LoginView } from "@/views/auth/login.view"

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const viewModel = useLoginViewModel()

  if (isLoading) return null
  if (isAuthenticated) return <Navigate to="/" replace />

  return <LoginView {...viewModel} />
}
