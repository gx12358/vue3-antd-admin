import colors from 'picocolors'
import type { PluginOption } from 'vite'
import { readPackageJSON } from 'pkg-types'

import { getEnvConfig, rootPath } from '../../util'
import { createContentHash, strToHex } from '../../util/hash'

const GLOBAL_CONFIG_FILE_NAME = '_app.config.js'
const PLUGIN_NAME = 'app-config'

async function createAppConfigPlugin({
  isBuild
}: {
  isBuild: boolean;
}): Promise<PluginOption> {
  let publicPath: string
  let source: string
  if (!isBuild) {
    return {
      name: PLUGIN_NAME
    }
  }
  const { version = '' } = await readPackageJSON(rootPath)

  return {
    name: PLUGIN_NAME,
    async configResolved(_config) {
      const appTitle = _config?.env?.VITE_GLOB_APP_TITLE ?? ''
      publicPath = _config.base
      source = await getConfigSource(appTitle)
    },
    async transformIndexHtml(html) {
      publicPath = publicPath.endsWith('/') ? publicPath : `${publicPath}/`

      const appConfigSrc = `${
        publicPath || '/'
      }${GLOBAL_CONFIG_FILE_NAME}?v=${version}-${createContentHash(source)}`

      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              src: appConfigSrc
            }
          }
        ]
      }
    },
    async generateBundle() {
      try {
        this.emitFile({
          type: 'asset',
          fileName: GLOBAL_CONFIG_FILE_NAME,
          source
        })
      } catch (error) {
        console.log(
          colors.red(`configuration file configuration file failed to package:\n${error}`)
        )
      }
    }
  }
}

/**
 * Get the configuration file variable name
 * @param env
 */
const getVariableName = (title: string) => {
  return `__PRODUCTION__${strToHex(title) || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '')
}

async function getConfigSource(appTitle: string) {
  const config = await getEnvConfig()
  const variableName = getVariableName(appTitle)
  const windowVariable = `window.${variableName}`
  // Ensure that the variable will not be modified
  let source = `${windowVariable}=${JSON.stringify(config)};`
  source += `
    Object.freeze(${windowVariable});
    Object.defineProperty(window, "${variableName}", {
      configurable: false,
      writable: false,
    });
  `.replace(/\s/g, '')
  return source
}

export { createAppConfigPlugin }
