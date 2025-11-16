import type { CSSOptions, UserConfig } from 'vite'
import type { DefineApplicationOptions } from '../typing'

import autoprefixer from 'autoprefixer'

import { defineConfig, loadEnv, mergeConfig } from 'vite'
import { loadApplicationPlugins } from '../plugins'
import { loadAndConvertEnv, wrapperEnv } from '../utils/env'
import { createProxy } from '../utils/proxy'
import { getCommonConfig } from './common'

function defineApplicationConfig<T = undefined>(userConfigPromise?: DefineApplicationOptions<T>) {
  return defineConfig(async (config) => {
    const { command, mode } = config
    const root = process.cwd()
    const env = loadEnv(mode, root)
    const viteEnv = wrapperEnv(env)
    const options = await userConfigPromise?.({
      ...config,
      env: viteEnv,
    })
    const envConfig = await loadAndConvertEnv()
    const { application = {}, vite = {} } = options || {}
    const isBuild = command === 'build'

    const plugins = await loadApplicationPlugins({
      archiver: true,
      archiverPluginOptions: {},
      compress: false,
      compressTypes: [ 'brotli', 'gzip' ],
      devtools: true,
      env,
      extraAppConfig: true,
      html: true,
      unocss: true,
      isBuild,
      license: true,
      injectMetadata: true,
      mode,
      ...envConfig,
      ...application
    })
    const applicationConfig: UserConfig = {
      server: {
        open: false,
        host: true,
        warmup: {
          // 预热文件
          clientFiles: [
            './index.html',
            './src/{views,layout,router,store,components}/*'
          ]
        },
        // @ts-ignore
        proxy: createProxy(application.proxy)[env.VITE_APP_ENV]
      },
      plugins,
      css: createCssOptions(),
    }

    const mergedCommonConfig = mergeConfig(
      await getCommonConfig(),
      applicationConfig
    )
    return mergeConfig(mergedCommonConfig, vite)
  })
}

function createCssOptions(): CSSOptions {
  return {
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
        javascriptEnabled: true,
        modifyVars: {
          hack: `true;  @import (reference) "@gx/styles/global";`
        },
      }
    }
  }
}

export { defineApplicationConfig }
