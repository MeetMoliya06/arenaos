import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from /live-demo/ inside the ArenaOS marketing site.
export default defineConfig({
  base: '/live-demo/',
  plugins: [react({ jsxRuntime: 'automatic' })],
  server: { port: 8081, host: true },
  build: { outDir: 'dist', sourcemap: false },
})
