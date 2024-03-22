/**
 * Generate additional configuration files when used for packaging. The file can be configured with some global variables, so that it can be changed directly externally without repackaging
 */
import fs, { writeFileSync } from 'fs-extra'
import chalk from 'chalk'

import { GLOB_CONFIG_FILE_NAME } from '../constant'
import { getRootPath, getEnvConfig } from '../utils'
import { getConfigFileName } from '../getConfigFileName'

import pkg from '../../package.json'

import { defaultSettings } from '../../config'

const { outputDir } = defaultSettings

function createConfig(
  {
    configName,
    config,
    configFileName = GLOB_CONFIG_FILE_NAME
  }: { configName: string; config: any; configFileName?: string } = { configName: '', config: {} }
) {
  try {
    const windowConf = `window.${configName}`
    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '')
    fs.mkdirp(getRootPath(outputDir))
    writeFileSync(getRootPath(`${outputDir}/${configFileName}`), configStr)

    console.log(chalk.bold(chalk.green(chalk.blue(`✨ [${pkg.name}]`) + ` - ${chalk.yellow(outputDir + '/' + configFileName)} is build successfully`)))
  } catch (error) {
    console.log(chalk.bold(chalk.red('configuration file configuration file failed to package:\n' + error)))
  }
}

export function runBuildConfig() {
  const config = getEnvConfig()
  const configFileName = getConfigFileName(config)
  createConfig({ config, configName: configFileName })
}
