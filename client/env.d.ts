/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_COOKIE_TOKEN_DURATION: number
    readonly VITE_API_SERVER_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}