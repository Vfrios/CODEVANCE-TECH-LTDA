import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Alias `@/` -> `src/` (espelha o jsconfig.json)
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // `/api/*` é encaminhado para o back-end local (server/index.js)
    proxy: {
      '/api': `http://localhost:${process.env.API_PORT || 3001}`,
    },
  },
});
