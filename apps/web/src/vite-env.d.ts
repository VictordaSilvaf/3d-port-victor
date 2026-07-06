/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_PROXY_TARGET: string
  readonly VITE_TURNSTILE_SITE_KEY: string
  readonly VITE_CDN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "*.glb" {
  const src: string
  export default src
}
