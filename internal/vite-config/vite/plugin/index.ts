import type { PluginOption } from 'vite'

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import TurboConsole from 'unplugin-turbo-console/vite'
// @ts-ignore
import { vitePluginFakeServer } from 'vite-plugin-fake-server'
import vueDevtools from 'vite-plugin-vue-devtools'

import { createAppConfigPlugin } from './appConfig'
import { createAutoImport } from './autoImport'
import { configCompressPlugin } from './compress'
import { configHtmlPlugin } from './html'
import { configVisualizerConfig } from './visualizer'
import viteNotice from './viteNotice'

export async function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_APP_ENV,
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
  } = viteEnv

  const isDev = VITE_APP_ENV === 'dev'

  const vitePlugins: PluginOption[] = [
    // have to
    vue(),
    // have to
    vueJsx()
  ]

  // vite-plugin-app-info
  vitePlugins.push(await createAppConfigPlugin({ isBuild }))
  // vite-plugin-vue-devtools
  vitePlugins.push(vueDevtools())
  // vite-plugin-windicss
  vitePlugins.push(Unocss())

  // unplugin-turbo-console
  isDev && vitePlugins.push(TurboConsole())
  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())
  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))
  // vite-plugin-build-info
  vitePlugins.push(await viteNotice())
  // vite-plugin-mock
  const useMock = isDev || VITE_USE_MOCK
  useMock && vitePlugins.push(vitePluginFakeServer({
    include: 'mock/routers',
    enableProd: VITE_USE_MOCK
  }))

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig())

  // unplugin-auto-import/vite
  vitePlugins.push(createAutoImport())

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    )
  }

  return vitePlugins
}
