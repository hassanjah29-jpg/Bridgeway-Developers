import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Relative asset paths so the built site works at any host path
  // (root domain, *.pages.dev, or a subdirectory).
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Allow the site to be served through the remote/web preview proxy domain.
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
})
