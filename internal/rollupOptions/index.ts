import type { RolldownOptions } from 'rolldown'
import externalGlobals from 'rollup-plugin-external-globals'
import { pathResolve } from '../util'
import { getExternalMap } from '../util/cdn'

export default function (useCdn: boolean) {
  return {
    input: {
      index: pathResolve('index.html')
    },
    // 静态资源分类打包
    output: {
      advancedChunks: {
        groups: [
          {
            name: 'lodash-es',
            test: /\/lodash-es/
          },
          {
            name: 'ant-design-vue',
            test: /\/ant-design-vue/
          },
          {
            name: 'echarts',
            test: /\/echarts/
          }
        ]
      },
      chunkFileNames: 'static/js/[name]-[hash].js',
      entryFileNames: 'static/js/[name]-[hash].js',
      assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
    },
    external: useCdn ? Object.keys(getExternalMap()) : [],
    plugins: useCdn ? [ externalGlobals(getExternalMap()) ] : []
  } as RolldownOptions
}
