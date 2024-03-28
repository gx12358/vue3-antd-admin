/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
import type { ProxyOptions } from 'vite'
import { isObject, isString } from '@gx-design-vue/pro-utils'
import defaultSettings from './defaultSettings'

type ProxyTargetList = ProxyOptions & { rewrite: (path: string) => string }

export function createProxy(prefix) {
  const ret = {
    dev: {},
    test: {},
    pre: {}
  }

  if (isObject(defaultSettings.proxyTarget)) {
    Object.keys(defaultSettings.proxyTarget).forEach((prefix) => {
      const proxy = {
        target: `${defaultSettings.proxyTarget[prefix]}`,
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(new RegExp(`^${prefix}`), '')
      } as ProxyTargetList

      ret.dev[prefix] = proxy
      ret.test[prefix] = proxy
      ret.pre[prefix] = proxy
    })
  } else if (isString(defaultSettings.proxyTarget)) {
    const proxy = {
      target: `${defaultSettings.proxyTarget}`,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), '')
    }
    ret.dev[prefix] = proxy
    ret.test[prefix] = proxy
    ret.pre[prefix] = proxy
  }

  return ret
}
