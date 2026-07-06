import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/providers/auth/auth.provider"
import { Skeleton } from "@workspace/ui/atoms/skeleton"

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <Skeleton className="h-8 w-48" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
