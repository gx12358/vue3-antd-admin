import type { RollupOptions } from 'rollup'
import externalGlobals from 'rollup-plugin-external-globals'
import { pathResolve } from '../util'
import { getExternalMap } from '../util/cdn'
import { configManualChunk } from './optimizer'

export default function (useCdn: boolean) {
  return {
    input: {
      index: pathResolve('index.html')
    },
    // 静态资源分类打包
    output: {
      manualChunks: configManualChunk,
      chunkFileNames: 'static/js/[name]-[hash].js',
      entryFileNames: 'static/js/[name]-[hash].js',
      assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
    },
    external: useCdn ? Object.keys(getExternalMap()) : [],
    plugins: useCdn ? [ externalGlobals(getExternalMap()) ] : []
  } as RollupOptions
}
