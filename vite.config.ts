import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import { resolve } from 'path'
import dayjs from 'dayjs'
import externalGlobals from 'rollup-plugin-external-globals'
import { generateModifyVars } from './build/generate/generateModifyVars'
import { wrapperEnv } from './build/utils'
import { createVitePlugins } from './build/vite/plugin'
import { configManualChunk } from './build/vite/optimizer'
import config, { createProxy } from './config/config'

import pkg from './package.json'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

const { publicPath, outputDir, assetsDir, devPort, useCdn, useProxy } = config.defaultSettings

const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
}

process.env.VUE_APP_VERSION = version

export default ({ command, mode }: ConfigEnv): UserConfig => {

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
          find: /\/types\//,
          replacement: pathResolve('types') + '/'
        },
        {
          find: /\/config\//,
          replacement: pathResolve('config') + '/'
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
          find: '@gx-admin/utils',
          replacement: pathResolve('src/components/_util') + '/'
        },
        {
          find: '@gx-admin/hooks',
          replacement: pathResolve('src/hooks') + '/'
        },
        { find: /^~/, replacement: '' }
      ]
    },
    server: {
      open: true,
      host: true,
      port: devPort,
      proxy: useProxy ? createProxy(VITE_BASE_URL)[VITE_APP_ENV] : {}
    },
    build: {
      outDir: outputDir,
      assetsDir,
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE
        }
      },
      chunkSizeWarningLimit: 2500,
      rollupOptions: useCdn
        ? {
          output: {
            manualChunks: configManualChunk
          },
          external: [ 'echarts' ],
          plugins: [
            externalGlobals({
              echarts: 'echarts'
            })
          ]
        } : {
          output: {
            manualChunks: configManualChunk
          }
        }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
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

    plugins: createVitePlugins(viteEnv, isBuild),

    optimizeDeps: {
      include: [
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US'
      ],
      exclude: [ 'vue-demi' ]
    }
  }
}
