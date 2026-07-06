import { apiRequest, setAccessToken } from "./client"
import type { LoginResponse } from "./types"

export const authApi = {
  register(body: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) {
    return apiRequest<LoginResponse & { message: string }>("/auth/register", {
      method: "POST",
      body,
    }).then((data) => {
      setAccessToken(data.access_token)
      return data
    })
  },

  login(email: string, password: string) {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    }).then((data) => {
      setAccessToken(data.access_token)
      return data
    })
  },

  logout() {
    return apiRequest<{ message: string }>("/auth/logout", {
      method: "POST",
      auth: false,
    }).finally(() => setAccessToken(null))
  },

  me() {
    return apiRequest<{
      id: string
      name: string
      email: string
      roles: string[]
      permissions: string[]
    }>("/users/me", { auth: true })
  },

  forgotPassword(email: string) {
    return apiRequest<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    })
  },

  resetPassword(body: {
    code: string
    password: string
    password_confirmation: string
  }) {
    return apiRequest<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body,
    })
  },

  changePassword(body: {
    current_password: string
    password: string
    password_confirmation: string
  }) {
    return apiRequest<{ message: string }>("/auth/change-password", {
      method: "POST",
      body,
      auth: true,
    })
  },
}
