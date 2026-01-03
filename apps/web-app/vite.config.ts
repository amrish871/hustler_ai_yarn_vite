import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths';



export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@myorg/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@myorg/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@myorg/shared-api': path.resolve(__dirname, '../../packages/shared-api/src'),
      '@myorg/auth': path.resolve(__dirname, '../../packages/auth/src')

    }
  },
  server: { 
    port: 3005,
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true,
      interval: 100
    },
    proxy: {
      '/api': {
        target: 'https://dev-hustle-service-g9g6emembfdyhwd4.canadacentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '') // Uncomment if backend does not expect /api prefix
      }
    }
  }
})
