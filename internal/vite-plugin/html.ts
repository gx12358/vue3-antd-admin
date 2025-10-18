import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

import { defaultSettings } from '../../config'
import pkg from '../../package.json'
import cdnModules from '../util/cdn'

const { cdn, system } = defaultSettings

const theme = [ 'light', 'dark', 'default' ]

export function configHtmlPlugin(_: ViteEnv, isBuild: boolean) {
  const injectScript = `const themeStorageKey = '${system.theme.storageKey}'
    const html = document.querySelector('html')
    let colorTheme = localStorage.getItem(themeStorageKey)
    colorTheme = colorTheme || '${system.theme.value}'
    // 这里获取系统的color模式
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const theme = colorTheme ? colorTheme === 'system' ? preferredDark ? 'dark' : 'light' : colorTheme : preferredDark ? 'dark' : 'light'
    html.setAttribute('data-theme', theme)`
  const injectLink = theme.map(str => `/css/${str}.css`)

  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      data: {
        VUE_APP_TITLE: system.title,
        VUE_APP_VERSION: pkg.version,
        injectThemeScript: `<script>${injectScript}</script>`,
        injectScript: cdn.use && isBuild
          ? cdnModules.map(e => e.js).filter(el => el)
          : [],
        injectLink: cdn.use && isBuild
          ? cdnModules.map(e => e.css).filter(el => el).concat(injectLink)
          : injectLink
      }
    }
  })
  return htmlPlugin
}
