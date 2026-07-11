import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In dev, forward the publish API to the Node server (npm run server).
    proxy: { '/api': 'http://localhost:8787' },
  },
})
