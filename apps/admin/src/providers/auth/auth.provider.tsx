import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { authApi } from "@/lib/api/auth.api"
import { getAccessToken } from "@/lib/api/client"

type AuthUser = {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  can: (permission: string) => boolean
  setSession: (data: {
    roles: string[]
    permissions: string[]
    user?: AuthUser
  }) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setSession = useCallback(
    (data: { roles: string[]; permissions: string[]; user?: AuthUser }) => {
      if (data.user) {
        setUser(data.user)
      } else if (user) {
        setUser({ ...user, roles: data.roles, permissions: data.permissions })
      }
    },
    [user]
  )

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi
      .me()
      .then((me) => setUser(me))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login({ email, password })
    const me = await authApi.me()
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  const can = useCallback(
    (permission: string) => {
      if (!user) return false
      return user.permissions.includes(permission)
    },
    [user]
  )

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      can,
      setSession,
    }),
    [user, isLoading, login, logout, can, setSession]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
