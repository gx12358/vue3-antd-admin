// #!/usr/bin/env node
import chalk from 'chalk'

import { runBuildConfig } from './buildConf'
import { getPackageSize, getRootPath } from '../utils'

import { defaultSettings } from '../../config'

import pkg from '../../package.json'

const { outputDir } = defaultSettings

export const runBuild = async () => {
  try {
    const argvList = process.argv.splice(2)

    // Generate configuration file
    if (!argvList.includes('disabled-config')) {
      await runBuildConfig()
    }

    getPackageSize({
      folder: getRootPath(outputDir),
      callBack: (size: string) => {
        console.log(chalk.bold(chalk.green(`✨ ${chalk.blue(`[${pkg.name}]`)}` + ' - all build successfully!' + `(size: ${size})`)))
      }
    })
  } catch (error) {
    console.log(chalk.bold(chalk.red('vite build error:\n' + error)))
    process.exit(1)
  }
}
runBuild()
