import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from '@gx/vite-config'

export default defineConfig(async () => {
  return {
    application: {
      nitroMock: false
    },
    vite: {
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
      },
    },
  }
})
