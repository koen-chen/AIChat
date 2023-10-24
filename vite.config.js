import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import react from '@vitejs/plugin-react'
import tailwindcss from  'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  plugins: [
    react()
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ]
    }
  },
  server: {
    port: 3000,
    host: 'localhost',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/l-mall.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/l-mall.crt'))
    }
  }
})
