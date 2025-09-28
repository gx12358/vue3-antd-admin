/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
import type { ProxyOptions } from 'vite'
import { isObject, isString } from '@gx-design-vue/pro-utils'
import { defaultSettings } from '../../config'

type ProxyTargetList = ProxyOptions & { rewrite: (path: string) => string }

export function createProxy(prefix) {
  const { proxy } = defaultSettings

  const ret: Record<ViteEnv['VITE_APP_ENV'], Record<string, Partial<ProxyTargetList>>> = {
    dev: {
      [prefix]: {}
    },
    pro: {
      [prefix]: {}
    }
  }

  if (isObject(proxy.target)) {
    Object.keys(proxy.target).forEach((val) => {
      if (val !== prefix) return
      const proxyOptions: ProxyTargetList = {
        target: `${proxy.target[val]}`,
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(new RegExp(`^${val}`), '')
      }

      ret.dev[val] = proxyOptions
      ret.pro[val] = proxyOptions
    })
  } else if (isString(proxy.target)) {
    const proxyOptions: ProxyTargetList = {
      target: `${proxy.target}`,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), '')
    }
    ret.dev[prefix] = proxyOptions
    ret.pro[prefix] = proxyOptions
  }

  return ret
}
