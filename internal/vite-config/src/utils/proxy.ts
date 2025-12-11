import type { ViteEnv } from '@gx/types'
import type { ProxyOptions } from 'vite'
import type { ApplicationPluginOptions } from '../typing'
import { isObject, isString } from '@gx-design-vue/pro-utils'

type ProxyTargetList = ProxyOptions & { rewrite: (path: string) => string }

export function createProxy(proxy: ApplicationPluginOptions['proxy']): Record<ViteEnv['VITE_APP_ENV'], Record<string, Partial<ProxyTargetList>>> {
  if (!proxy) return {} as any
  const { prefix, target } = proxy
  const ret: Record<ViteEnv['VITE_APP_ENV'], Record<string, Partial<ProxyTargetList>>> = {
    dev: {
      [prefix]: {}
    },
    pro: {
      [prefix]: {}
    }
  }

  if (isObject(target)) {
    Object.keys(target).forEach((val) => {
      if (val !== prefix) return
      const proxyOptions: ProxyTargetList = {
        target: `${target[val]}`,
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(new RegExp(`^${val}`), '')
      }

      ret.dev[val] = proxyOptions
      ret.pro[val] = proxyOptions
    })
  } else if (isString(target)) {
    const proxyOptions: ProxyTargetList = {
      target: `${target}`,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), '')
    }
    ret.dev[prefix] = proxyOptions
    ret.pro[prefix] = proxyOptions
  }

  return ret
}
