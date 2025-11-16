import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from '@gx/vite-config'
import { app } from './config'
import createRollupOptions from './plugin/rollupOptions'

const { proxy, build, server, system } = app

export default defineConfig<GlobalViteEnv>(async (config) => {
  const theme = [ 'light', 'dark', 'default' ]

  const injectScript = `const themeStorageKey = '${system.theme.storageKey}'
    const html = document.querySelector('html')
    let colorTheme = localStorage.getItem(themeStorageKey)
    colorTheme = colorTheme || '${system.theme.value}'
    // 这里获取系统的color模式
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const theme = colorTheme ? colorTheme === 'system' ? preferredDark ? 'dark' : 'light' : colorTheme : preferredDark ? 'dark' : 'light'
    html.setAttribute('data-theme', theme)`
  const injectLink = theme.map(str => `/css/${str}.css`)

  return {
    application: {
      proxy: {
        target: proxy.target,
        prefix: config?.env?.VITE_PROXY_PREFIX,
      },
      html: {
        VUE_APP_TITLE: system.title,
        injectThemeScript: `<script>${injectScript}</script>`,
        injectScript: [],
        injectLink
      }
    },
    vite: {
      base: build.publicPath,
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
          '@images': fileURLToPath(new URL('./src/assets/images', import.meta.url)),
          '@gx-config': fileURLToPath(new URL('./config/index.ts', import.meta.url)),
          '@gx-vuex': fileURLToPath(new URL('./src/store/index.ts', import.meta.url)),
          '@gx-mock': fileURLToPath(new URL('./mock', import.meta.url))
        }
      },
      server: {
        port: server.port,
      },
      esbuild: {
        drop: config?.env?.VITE_DROP_CONSOLE ? [ 'console', 'debugger' ] : []
      },
      build: {
        outDir: build.outputDir,
        assetsDir: build.assetsDir,
        chunkSizeWarningLimit: 4000,
        rollupOptions: {
          output: createRollupOptions()
        }
      },
      optimizeDeps: {
        include: [
          'ant-design-vue',
          'dayjs',
          'lodash-es',
          'pinia',
          '@vueuse/core',
          'dayjs/plugin/advancedFormat',
          'dayjs/plugin/relativeTime',
          'dayjs/plugin/weekOfYear'
        ]
      }
    },
  }
})
