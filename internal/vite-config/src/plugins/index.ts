import type { PluginOption } from 'vite'
import type { ApplicationPluginOptions, CommonPluginOptions, ConditionPlugin, LibraryPluginOptions } from '../typing'
import { readPackageJSON } from '@gx/node-utils'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer as viteVisualizerPlugin } from 'rollup-plugin-visualizer'
import Unocss from 'unocss/vite'
import TurboConsole from 'unplugin-turbo-console/vite'
import viteCompressPlugin from 'vite-plugin-compression'
import viteDtsPlugin from 'vite-plugin-dts'
import { createHtmlPlugin as viteHtmlPlugin } from 'vite-plugin-html'
import viteVueDevTools from 'vite-plugin-vue-devtools'
import { viteArchiverPlugin } from './archiver'

import { createAutoImport } from './autoImport'
import { viteExtraAppConfigPlugin } from './extra-app-config'
import { vitePluginFakeServer } from './fake-server'
import { viteMetadataPlugin } from './inject-metadata'
import { viteLicensePlugin } from './license'
import { viteNitroMockPlugin } from './nitro-mock'
import { vitePrintPlugin } from './print'
/**
 * 获取条件成立的 vite 插件
 * @param conditionPlugins
 */
async function loadConditionPlugins(conditionPlugins: ConditionPlugin[]) {
  const plugins: PluginOption[] = []
  for (const conditionPlugin of conditionPlugins) {
    if (conditionPlugin.condition) {
      const realPlugins = await conditionPlugin.plugins()
      plugins.push(...realPlugins)
    }
  }
  return plugins.flat()
}

/**
 * 根据条件获取通用的vite插件
 */
async function loadCommonPlugins(
  options: CommonPluginOptions,
): Promise<ConditionPlugin[]> {
  const { devtools, isBuild, visualizer, injectMetadata } = options
  return [
    {
      condition: true,
      plugins: () => [
        Vue(),
        VueJsx(),
        createAutoImport(),
      ],
    },
    {
      condition: !isBuild && devtools,
      plugins: () => [viteVueDevTools()],
    },
    {
      condition: injectMetadata,
      plugins: async () => [await viteMetadataPlugin()],
    },
    {
      condition: isBuild && !!visualizer,
      plugins: () => [<PluginOption>viteVisualizerPlugin({
        filename: './node_modules/.cache/visualizer/stats.html',
        gzipSize: true,
        open: true,
      })],
    },
  ]
}

/**
 * 根据条件获取应用类型的vite插件
 */
async function loadApplicationPlugins(
  options: ApplicationPluginOptions,
): Promise<PluginOption[]> {
  // 单独取，否则commonOptions拿不到
  const isBuild = options.isBuild

  const {
    unocss,
    turboConsole,
    archiver,
    archiverPluginOptions,
    compress,
    compressTypes,
    extraAppConfig,
    html,
    mock,
    license,
    print,
    printInfoMap,
    nitroMock,
    nitroMockOptions,
    ...commonOptions
  } = options

  const { version } = await readPackageJSON(process.cwd())
  const commonPlugins = await loadCommonPlugins(commonOptions)
  return await loadConditionPlugins([
    ...commonPlugins,
    {
      condition: unocss,
      plugins: async () => {
        return [await Unocss()]
      },
    },
    {
      condition: turboConsole,
      plugins: async () => {
        return [await TurboConsole()]
      },
    },
    {
      condition: mock,
      plugins: async () => {
        return [await vitePluginFakeServer({
          include: 'mock',
          enableProd: mock
        })]
      },
    },
    {
      condition: nitroMock,
      plugins: async () => {
        return [await viteNitroMockPlugin(nitroMockOptions)]
      },
    },
    {
      condition: print,
      plugins: async () => {
        return [await vitePrintPlugin({ infoMap: printInfoMap })]
      },
    },
    {
      condition: license,
      plugins: async () => [await viteLicensePlugin()],
    },
    {
      condition: isBuild && !!compress,
      plugins: () => {
        const compressPlugins: PluginOption[] = []
        if (compressTypes?.includes('brotli')) {
          compressPlugins.push(
            viteCompressPlugin({ deleteOriginFile: false, ext: '.br' }),
          )
        }
        if (compressTypes?.includes('gzip')) {
          compressPlugins.push(
            viteCompressPlugin({ deleteOriginFile: false, ext: '.gz' }),
          )
        }
        return compressPlugins
      },
    },
    {
      condition: !!html,
      plugins: () => [viteHtmlPlugin({
        minify: isBuild,
        inject: {
          data: {
            VUE_APP_VERSION: version,
            ...(typeof html === 'object' ? html : {})
          },
        }
      })],
    },
    {
      condition: isBuild && extraAppConfig,
      plugins: async () => [
        await viteExtraAppConfigPlugin({ isBuild: true, root: process.cwd() }),
      ],
    },
    {
      condition: archiver,
      plugins: async () => {
        return [await viteArchiverPlugin(archiverPluginOptions)]
      },
    },
  ])
}

/**
 * 根据条件获取库类型的vite插件
 */
async function loadLibraryPlugins(
  options: LibraryPluginOptions,
): Promise<PluginOption[]> {
  // 单独取，否则commonOptions拿不到
  const isBuild = options.isBuild
  const { dts, ...commonOptions } = options
  const commonPlugins = await loadCommonPlugins(commonOptions)
  return await loadConditionPlugins([
    ...commonPlugins,
    {
      condition: isBuild && !!dts,
      plugins: () => [viteDtsPlugin({ logLevel: 'error' })],
    },
  ])
}

export {
  loadApplicationPlugins,
  loadLibraryPlugins,
  viteArchiverPlugin,
  viteCompressPlugin,
  viteHtmlPlugin,
  viteVisualizerPlugin,
}
