import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiTarget = env.VITE_API_PROXY_TARGET ?? "http://localhost:9501"

  return {
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      include: [
        "three",
        "@react-three/fiber",
        "@react-three/drei",
        "gsap",
        "leva",
        "zustand",
      ],
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": { target: apiTarget, changeOrigin: true },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    assetsInclude: ["**/*.glb"],
  }
})
