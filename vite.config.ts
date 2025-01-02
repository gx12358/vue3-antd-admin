import type { ConfigEnv, UserConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import dayjs from 'dayjs'
import { loadEnv } from 'vite'

import { createProxy, defaultSettings } from './config'
import { generateModifyVars } from './internal/vite-config/generate/generateModifyVars'
import createRollupOptions from './internal/vite-config/rollupOptions'
import { pathResolve, wrapperEnv } from './internal/vite-config/util'

import { createVitePlugins } from './internal/vite-config/vite/plugin'

import pkg from './package.json'

const { proxy, cdn, build, servive } = defaultSettings

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

  const { VITE_DROP_CONSOLE, VITE_APP_ENV, VITE_PROXY_PREFIX } = viteEnv

  const isBuild = command === 'build'

  return {
    base: build.publicPath,
    root,
    resolve: {
      alias: [
        {
          find: '@',
          replacement: pathResolve('src') + '/'
        },
        {
          find: '@gx-mock',
          replacement: pathResolve('mock') + '/index.ts'
        },
        {
          find: '@gx-mock',
          replacement: pathResolve('mock') + '/'
        },
        {
          find: '@gx-config',
          replacement: pathResolve('config') + '/index.ts'
        },
        {
          find: '@gx-vuex',
          replacement: pathResolve('src/store') + '/index.ts'
        },
        {
          find: '@gx-design',
          replacement: pathResolve('src/components/GDesign') + '/'
        },
        {
          find: '@gx-admin/hooks',
          replacement: pathResolve('src/hooks') + '/'
        }
      ]
    },
    server: {
      open: false,
      host: true,
      port: servive.port,
      warmup: {
        // 预热文件
        clientFiles: [
          './index.html',
          './src/{views,layout,router,store,components}/*',
        ],
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
      rollupOptions: createRollupOptions(cdn.use) as any
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
          })
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
        'dayjs',
        'axios',
        'pinia',
        'echarts',
        '@vueuse/core'
      ]
    }
  }
}
