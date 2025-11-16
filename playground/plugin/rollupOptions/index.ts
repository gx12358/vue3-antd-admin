const vendorLibs: { match: string[]; output: string }[] = [
  {
    match: ['ant-design-vue'],
    output: 'ant-design-vue',
  },
  {
    match: ['echarts'],
    output: 'echarts',
  },
]

export const configManualChunk = (id: string) => {
  if (/[\\/]node_modules[\\/]/.test(id)) {
    const matchItem = vendorLibs.find((item) => {
      const reg = new RegExp(`[\\/]node_modules[\\/]_?(${item.match.join('|')})(.*)`, 'gi')
      return reg.test(id)
    })
    return matchItem ? matchItem.output : null
  }
}

export default function () {
  return {
    manualChunks: configManualChunk,
    chunkFileNames: 'static/js/[name]-[hash].js',
    entryFileNames: 'static/js/[name]-[hash].js',
    assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
  }
}
