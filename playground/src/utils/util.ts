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
