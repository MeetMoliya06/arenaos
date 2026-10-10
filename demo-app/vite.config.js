import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from /live-demo/ inside the ArenaOS marketing site.
export default defineConfig({
  base: '/live-demo/',
  plugins: [react({ jsxRuntime: 'automatic' })],
  server: { port: 8081, host: true },
  // No source maps, no console output, and a copyright banner on every shipped chunk.
  esbuild: { drop: ['console', 'debugger'], legalComments: 'none' },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: { banner: '/* (c) ArenaOS. All rights reserved. Copying or reuse without written permission is prohibited. */' },
    },
  },
})
