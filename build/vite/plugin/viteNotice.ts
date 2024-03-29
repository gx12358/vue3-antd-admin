import type { Plugin } from 'vite'
import chalk from 'chalk'
import { readPackageJSON } from 'pkg-types'
import { defaultSettings } from '../../../config'
import { getPackageSize, getRootPath, rootPath } from '../../util'

const { outputDir } = defaultSettings

export default async function viteNotice(): Promise<Plugin> {
  let config: { command: string }
  const { name = '' } = await readPackageJSON(rootPath)

  return {
    name: 'vite:notice',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    buildStart() {
      console.log(
        chalk.bold(
          chalk.green(
            `👏Welcome to use ${chalk.blue(
              '[gx-design-pro]'
            )}, If you feel good, remember to click on the link below to give a star https://github.com/gx12358/vue3-antd-admin`
          )
        )
      )
    },
    closeBundle() {
      if (config.command === 'build') {
        getPackageSize({
          folder: getRootPath(outputDir),
          callBack: (size: string) => {
            console.log(chalk.bold(chalk.green(`✨ ${chalk.blue(`[${name}]`)} all build successfully, Total files ${size}`)))
          }
        })
      }
    }
  }
}
