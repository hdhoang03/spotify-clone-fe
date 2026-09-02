import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests để bypass CORS ở local dev
      '/api-proxy': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, '/spotify'),
      },
      // Proxy Cloudinary images để bypass CORS khi fetch ảnh cho share card
      '/cloudinary-proxy': {
        target: 'https://res.cloudinary.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloudinary-proxy/, ''),
      },
    },
  },
})
