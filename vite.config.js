import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    reporters: ['default', 'html'],
    include: ['tests/unit/**/*.test.{js,jsx}'],
    api: {
      port: 3009,
      host: '127.0.0.1',
    },
  },
})

