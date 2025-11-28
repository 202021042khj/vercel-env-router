import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vercelEnvRouter } from '@vercel-env-router/vite'

export default defineConfig({
  plugins: [
    vercelEnvRouter({
      verbose: true,
    }),
    react(),
  ],
})
