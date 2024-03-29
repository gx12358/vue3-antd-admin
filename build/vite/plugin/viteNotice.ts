import type { Plugin } from 'vite'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import chalk from 'chalk'
import { readPackageJSON } from 'pkg-types'
import { defaultSettings } from '../../../config'
import { getPackageSize, getRootPath, rootPath } from '../../util'

dayjs.extend(duration)

const { outputDir } = defaultSettings

export default async function viteNotice(): Promise<Plugin> {
  let config: { command: string }
  let startTime: Dayjs
  let endTime: Dayjs
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

      if (config.command === 'build') {
        startTime = dayjs()
      }
    },
    closeBundle() {
      if (config.command === 'build') {
        endTime = dayjs()
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
