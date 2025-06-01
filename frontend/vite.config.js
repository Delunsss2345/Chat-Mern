import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['cloudinary'] // ← Thêm dòng này
  },
  build: {
    rollupOptions: {
      external: ['cloudinary'] // ← Và dòng này
    }
  }
})