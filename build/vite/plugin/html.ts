import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

import cdnModules from '../cdn'
import { GLOB_CONFIG_FILE_NAME } from '../../constant'
import { defaultSettings } from '../../../config'
import pkg from '../../../package.json'

const { title, publicPath, useCdn } = defaultSettings

export function configHtmlPlugin(_: ViteEnv, isBuild: boolean) {
  const path = publicPath.endsWith('/') ? publicPath : `${publicPath}/`

  const getAppConfigSrc = () => {
    return `${path || '/'}${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`
  }

  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      data: {
        VUE_APP_TITLE: title,
        injectScript: useCdn && isBuild ? cdnModules.map(e => e.js).filter(el => el) : [],
        injectLink: useCdn && isBuild ? cdnModules.map(e => e.css).filter(el => el) : []
      },
      // Embed the generated app.config.js file
      tags: isBuild
        ? [
          {
            tag: 'script',
            attrs: { src: getAppConfigSrc() }
          }
        ]
        : []
    }
  })
  return htmlPlugin
}
