import { apiRequest } from "./client"

export const contactApi = {
  submit(body: {
    name: string
    email: string
    subject?: string | null
    message: string
    cf_turnstile_response?: string
  }) {
    return apiRequest<{ message: string }>("/contact", {
      method: "POST",
      body,
    })
  },
}
