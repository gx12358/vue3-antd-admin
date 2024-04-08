import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import dayjs from 'dayjs'
import autoprefixer from 'autoprefixer'

import { generateModifyVars } from './build/generate/generateModifyVars'
import { pathResolve, wrapperEnv } from './build/util'
import createRollupOptions from './build/rollupOptions'
import { createVitePlugins } from './build/vite/plugin'

import { createProxy, defaultSettings } from './config'

import pkg from './package.json'

const { publicPath, outputDir, assetsDir, devPort, useCdn, useProxy } = defaultSettings

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

  const { VITE_DROP_CONSOLE, VITE_APP_ENV, VITE_BASE_URL } = viteEnv

  const isBuild = command === 'build'

  return {
    base: publicPath,
    root,
    resolve: {
      alias: [
        {
          find: '@',
          replacement: pathResolve('src') + '/'
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
      port: devPort,
      proxy: useProxy ? createProxy(VITE_BASE_URL)[VITE_APP_ENV] : {}
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE ? [ 'console', 'debugger' ] : []
    },
    build: {
      outDir: outputDir,
      assetsDir,
      chunkSizeWarningLimit: 4000,
      rollupOptions: createRollupOptions(useCdn) as any
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
