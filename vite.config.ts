import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In dev the live demo is its own Vite app (`npm run dev:demo`); proxy it so /live-demo/ works
    // on the marketing site's port exactly as it does in production.
    proxy: {
      '/live-demo': { target: 'http://localhost:8081', ws: true },
    },
  },
})
