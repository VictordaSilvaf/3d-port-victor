import { apiRequest, setAccessToken } from "./client"
import type { LoginResponse } from "./types"

export type LoginInput = {
  email: string
  password: string
}

export const authApi = {
  login(input: LoginInput) {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: input,
      auth: false,
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

  refresh() {
    return apiRequest<LoginResponse>("/auth/refresh", {
      method: "POST",
      body: {},
    }).then((data) => {
      setAccessToken(data.access_token)
      return data
    })
  },

  me() {
    return apiRequest<{
      id: string
      name: string
      email: string
      roles: string[]
      permissions: string[]
    }>("/users/me")
  },

  changePassword(input: {
    current_password: string
    password: string
    password_confirmation: string
  }) {
    return apiRequest<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: input,
    })
  },
}
