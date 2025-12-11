import { app } from '@gx-config'
import { isObject, scrollTo } from '@gx-design-vue/pro-utils'

const { viewScrollRoot } = app.system

/**
 * @Author      gx12358
 * @DateTime    2022/10/11
 * @lastTime    2022/10/11
 * @description 滚动到固定位置
 */
export function scrollToContainer(options: { count: number; root?: string; duration?: number }) {
  if (!isObject(options))
    return
  scrollTo(options.count || 0, {
    getContainer: () => document.querySelector(options?.root || viewScrollRoot) as HTMLInputElement,
    duration: options?.duration || 450
  })
}

export function numeral(value?: number) {
  return {
    format(fmt) {
      const num = Number(value)
      if (Number.isNaN(num)) return ''

      // 自动单位：1k、1.2m、3b ...
      if (fmt.includes('a')) {
        const abs = Math.abs(num)
        if (abs >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'b'
        if (abs >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'm'
        if (abs >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
      }

      // 判断是否需要千分位，例如格式里有 ','
      const needComma = fmt.includes(',')

      // 解析需要的小数位数：0.00 → 2 位
      const decimalMatch = fmt.match(/\.(0+)/)
      const decimals = decimalMatch ? decimalMatch[1].length : 0

      let str = num.toFixed(decimals)

      // 千分位处理
      if (needComma) {
        const parts = str.split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        str = parts.join('.')
      }

      return str
    }
  }
}
