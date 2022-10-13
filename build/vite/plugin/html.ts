/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import { PluginOption } from 'vite'

import { createHtmlPlugin } from 'vite-plugin-html'

import pkg from '../../../package.json'
import { GLOB_CONFIG_FILE_NAME } from '../../constant'
import config from '../../../config/config'
import { cdnConf } from '../cdn'

const { title, publicPath, useCdn } = config.defaultSettings

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
        VUE_APP_TITLE: title || 'GX Pro Admin',
        injectScript: useCdn ? cdnConf.js : [],
        injectLink: useCdn ? cdnConf.css : [],
      },
      // Embed the generated app.config.js file
      tags: isBuild
        ? [
          {
            tag: 'script',
            attrs: {
              src: getAppConfigSrc()
            }
          }
        ]
        : []
    }
  })
  return htmlPlugin
}
