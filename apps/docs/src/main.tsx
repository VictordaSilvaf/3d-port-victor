import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@workspace/ui/globals.css"
import { App } from "./App.tsx"
import { ThemeProvider } from "@/providers/theme/theme.provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="theme-docs">
      <App />
    </ThemeProvider>
  </StrictMode>
)
