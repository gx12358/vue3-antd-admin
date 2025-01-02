import type { RollupOptions } from 'rollup'
import externalGlobals from 'rollup-plugin-external-globals'
import { pathResolve } from '../util'
import { configManualChunk } from '../vite/optimizer'
import { getExternalMap } from '../vite/cdn'

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
