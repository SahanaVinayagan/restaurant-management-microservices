import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/restaurants': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/orders': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/payments': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/restaurants/': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/orders/': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/payments/': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/logs': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
      '/logs/': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      },
    },
  },
})
