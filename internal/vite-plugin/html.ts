import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

import { defaultSettings } from '../../config'
import pkg from '../../package.json'
import cdnModules from '../util/cdn'

const { cdn, system } = defaultSettings

export function configHtmlPlugin(_: ViteEnv, isBuild: boolean) {
  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      data: {
        VUE_APP_TITLE: system.title,
        VUE_APP_VERSION: pkg.version,
        injectScript: cdn.use && isBuild ? cdnModules.map(e => e.js).filter(el => el) : [],
        injectLink: cdn.use && isBuild ? cdnModules.map(e => e.css).filter(el => el) : []
      }
    }
  })
  return htmlPlugin
}
