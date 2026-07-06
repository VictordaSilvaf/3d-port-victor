import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "@workspace/ui/globals.css"
import { Toaster } from "@workspace/ui/atoms/sonner"
import { App } from "./App.tsx"
import { AuthProvider } from "@/providers/auth/auth.provider"
import { QueryProvider } from "@/providers/query/query.provider"
import { ThemeProvider } from "@/providers/theme/theme.provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider storageKey="theme-admin">
            <App />
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
)
