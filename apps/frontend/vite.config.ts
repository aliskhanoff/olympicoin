import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { join
 } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": join(__dirname, "src/components/shared"),
      "@widgets": join(__dirname, "src/components/widgets"),
      "@features": join(__dirname, "src/components/features"),
      "@pages": join(__dirname, "src/components/pages"),
      "@app": join(__dirname, "src/components/app"),
    }
  }
})
