import type { ApplicationPluginOptions } from '../typing'

import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'

import { join } from 'node:path'

import dotenv from 'dotenv'

const getBoolean = (value: string | undefined) => value === 'true'

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script as string
  const reg = /--mode ([\d_a-z]+)/
  const result = reg.exec(script)
  let mode = 'production'
  if (result) {
    mode = result[1] as string
  }
  return ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`]
}

export function wrapperEnv(envConf: Recordable): any {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName

    ret[envName] = realName
  }
  return ret
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
async function loadEnv<T = Record<string, string>>(
  match = 'VITE_GLOB_',
  confFiles = getConfFiles(),
) {
  let envConfig = {}

  for (const confFile of confFiles) {
    try {
      const confFilePath = join(process.cwd(), confFile)
      if (existsSync(confFilePath)) {
        const envPath = await fs.readFile(confFilePath, {
          encoding: 'utf8',
        })
        const env = dotenv.parse(envPath)
        envConfig = { ...envConfig, ...env }
      }
    } catch (error) {
      console.error(`Error while parsing ${confFile}`, error)
    }
  }
  const reg = new RegExp(`^(${match})`)
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key)
    }
  })
  return envConfig as T
}

async function loadAndConvertEnv(
  match = 'VITE_',
  confFiles = getConfFiles(),
): Promise<
  Partial<ApplicationPluginOptions>
> {
  const envConfig = await loadEnv(match, confFiles)

  const {
    VITE_ARCHIVER,
    VITE_COMPRESS,
    VITE_USE_MOCK,
    VITE_VISUALIZER,
  } = envConfig

  const compressTypes = (VITE_COMPRESS ?? '')
    .split(',')
    .filter(item => item === 'brotli' || item === 'gzip')

  return {
    archiver: getBoolean(VITE_ARCHIVER),
    compress: compressTypes.length > 0,
    compressTypes,
    mock: getBoolean(VITE_USE_MOCK),
    visualizer: getBoolean(VITE_VISUALIZER),
  }
}

export { loadAndConvertEnv, loadEnv }
