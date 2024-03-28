import type { PluginOption } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import legacy from '@vitejs/plugin-legacy'

import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import Unocss from 'unocss/vite'

import { configPwaConfig } from './pwa'
import { configHtmlPlugin } from './html'
import { configMockPlugin } from './mock'
import viteNotice from './viteNotice'
import { createAutoImport } from './autoImport'
import { configCompressPlugin } from './compress'
import { createAppConfigPlugin } from './appConfig'
import { configVisualizerConfig } from './visualizer'

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
  vitePlugins.push(VueDevTools() as any)
  // vite-plugin-windicss
  vitePlugins.push(Unocss())
  // vite-plugin-vue-setup-extend
  vitePlugins.push(vueSetupExtend())
  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())
  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))
  // vite-plugin-build-info
  vitePlugins.push(await viteNotice())
  // vite-plugin-mock
  const useMock = isDev || VITE_USE_MOCK
  useMock && vitePlugins.push(configMockPlugin())

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

    // vite-plugin-pwa
    vitePlugins.push(configPwaConfig(viteEnv))
  }

  return vitePlugins
}
