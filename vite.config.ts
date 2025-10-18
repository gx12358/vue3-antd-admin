import type { ConfigEnv, UserConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import autoprefixer from 'autoprefixer'
import dayjs from 'dayjs'
import { loadEnv } from 'vite'

import { defaultSettings } from './config'
import { generateModifyVars } from './internal/generate/generateModifyVars'
import { createProxy } from './internal/proxy'
import createRollupOptions from './internal/rollupOptions'
import { wrapperEnv } from './internal/util'
import { createVitePlugins } from './internal/vite-plugin'

import pkg from './package.json'

const { proxy, cdn, build, server } = defaultSettings
const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
}

process.env.VUE_APP_VERSION = version

export default async ({ command, mode }: ConfigEnv): Promise<UserConfig> => {
  const root = process.cwd()

  const env = loadEnv(mode, root)

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env)

  const { VITE_APP_ENV, VITE_PROXY_PREFIX, VITE_DROP_CONSOLE } = viteEnv

  const isBuild = command === 'build'

  return {
    base: build.publicPath,
    root,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@images': fileURLToPath(new URL('./src/assets/images', import.meta.url)),
        '@gx-config': fileURLToPath(new URL('./config/index.ts', import.meta.url)),
        '@gx-vuex': fileURLToPath(new URL('./src/store/index.ts', import.meta.url)),
        '@gx-mock': fileURLToPath(new URL('./mock', import.meta.url)),
        '@gx-design': fileURLToPath(new URL('./src/components/GDesign', import.meta.url)),
        '@gx-admin/hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      }
    },
    server: {
      open: false,
      host: true,
      port: server.port,
      warmup: {
        // 预热文件
        clientFiles: [
          './index.html',
          './src/{views,layout,router,store,components}/*'
        ]
      },
      proxy: proxy.use ? createProxy(VITE_PROXY_PREFIX)[VITE_APP_ENV] : {}
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE ? [ 'console', 'debugger' ] : []
    },
    build: {
      outDir: build.outputDir,
      assetsDir: build.assetsDir,
      chunkSizeWarningLimit: 4000,
      rolldownOptions: createRollupOptions(cdn.use)
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            grid: true
          }),
        ]
      },
      modules: {
        generateScopedName: 'gx-pro-[local]-[hash:base64:5]'
      },
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true
        }
      }
    },

    plugins: await createVitePlugins(viteEnv, isBuild),

    optimizeDeps: {
      include: [
        'qs',
        '@gx-design-vue/pro-layout',
        '@gx-design-vue/pro-layout-components',
        '@gx-design-vue/pro-table',
        '@gx-design-vue/image',
        '@gx-design-vue/scrollbar',
        '@gx-design-vue/pro-modal',
        '@gx-design-vue/pro-utils',
        '@gx-design-vue/pro-provider',
        '@gx-design-vue/pro-hooks',
        'ant-design-vue',
        'dayjs',
        'axios',
        'lodash-es',
        'pinia',
        'echarts',
        '@vueuse/core',
        'dayjs/plugin/advancedFormat',
        'dayjs/plugin/relativeTime',
        'dayjs/plugin/weekOfYear'
      ]
    }
  }
}
