(async () => {
  try {
    await import('mockjs')
  } catch (e) {
    throw new Error('vite-plugin-vue-mock requires mockjs to be present in the dependency tree.')
  }
})()

import type { Plugin, ResolvedConfig } from 'vite'
import { normalizePath } from 'vite'
import path from 'node:path'
import type { ViteMockOptions } from './types'
import { fileExists } from './utils'
import { createMockServer, requestMiddleware } from './createMockServer'

function getDefaultPath(supportTs = true) {
  return path.resolve(process.cwd(), `src/main.${supportTs ? 'ts' : 'js'}`)
}

export function viteMockServe(opt: ViteMockOptions = {}): Plugin {
  let isDev = false
  let needSourcemap = false
  let config: ResolvedConfig
  let defaultPath = getDefaultPath()
  if (!fileExists(defaultPath)) {
    defaultPath = getDefaultPath(false)
    if (!fileExists(defaultPath)) {
      defaultPath = ''
    }
  }

  const defaultEnter = normalizePath(defaultPath)

  const { injectFile = defaultEnter } = opt

  return {
    name: 'vite:mock',
    enforce: 'pre' as const,
    configResolved(resolvedConfig) {
      config = resolvedConfig
      isDev = config.command === 'serve'
      needSourcemap = !!resolvedConfig.build.sourcemap
      isDev && createMockServer(opt, config)
    },

    configureServer: async ({ middlewares }) => {
      const { enable = isDev } = opt
      if (!enable) {
        return
      }
      const middleware = await requestMiddleware(opt)
      middlewares.use(middleware)
    },
    transform: (code, id) => {
      if (isDev || !injectFile || !id.endsWith(injectFile)) {
        return null
      }

      const { injectCode = '' } = opt

      return {
        map: needSourcemap ? this.getCombinedSourcemap() : null,
        code: `${code}\n${injectCode}`
      }
    }
  }
}

export * from './types'
