import fs from 'node:fs'
import path, { resolve } from 'node:path'
import dotenv from 'dotenv'

export const rootPath = process.cwd()

export function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

/**
 * Whether to generate package preview
 */
export function isReportMode(): boolean {
  return process.env.REPORT === 'true'
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName

    ret[envName] = realName
    process.env[envName] = realName
  }
  return ret
}

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script
  const reg = new RegExp('--mode ([a-z]+)')
  const result = reg.exec(script as string) as any
  if (result) {
    const mode = result[1] as string
    return [ '.env', `.env.${mode}` ]
  }
  return [ '.env', '.env.production' ]
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export function getEnvConfig(confFiles = getConfFiles()): Partial<ViteEnv> {
  let envConfig: Partial<ViteEnv> = {}
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)))
      envConfig = { ...envConfig, ...env }
    } catch (e) {
      console.error(`Error in parsing ${item}`, e)
    }
  })
  return envConfig
}

/**
 * Get user root directory
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir)
}

export function getDefaultPath(supportTs = true) {
  return path.resolve(process.cwd(), `src/main.${supportTs ? 'ts' : 'js'}`)
}

export function fileExists(f: string) {
  try {
    fs.accessSync(f, fs.constants.W_OK)
    return true
  } catch (error) {
    return false
  }
}

function q(t) {
  return t.reduce((n, e) => n + e)
}

function Gt(t, n?: number) {
  if (t === 0)
    return '0 Bytes'
  const e = 1024
  const r = n || 2
  const o = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ]
  const s = Math.floor(Math.log(t) / Math.log(e))
  return `${Number.parseFloat((t / e ** s).toFixed(r))} ${o[s]}`
}

const ot = []

export function getPackageSize({ folder, callBack, format = !0 }) {
  fs.readdir(folder, (err, files) => {
    if (err)
      throw err

    let index = 0
    const callBacks = () => {
      if (++index === files.length) {
        callBack(format ? Gt(q(ot)) : q(ot))
      }
    }

    files.forEach((p) => {
      fs.stat(`${folder}/${p}`, (err, stat) => {
        if (err)
          throw err
        if (stat.isFile()) {
          ot.push(stat.size)
          callBacks()
        } else {
          getPackageSize({
            folder: `${folder}/${p}`,
            callBack: callBacks
          })
        }
      })
    })

    files.length === 0 && callBack(0)
  })
}
