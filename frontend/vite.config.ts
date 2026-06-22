import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': '/src',
      '@modules': '/src/modules',
      '@layouts': '/src/layouts',
      '@providers': '/src/providers',
      '@router': '/src/router',
      '@theme': '/src/theme',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@constants': '/src/constants',
      '@services': '/src/services',
      '@assets': '/src/assets',
    },
  },
  server: {
    open: true,
  },
})
