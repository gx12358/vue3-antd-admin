import type { ViteEnv } from '@gx/types'

/**
 * @Author      gx12358
 * @DateTime    2022/4/1
 * @lastTime    2022/4/1
 * @description 环境：本地开发环境
 */
export function isDev(): boolean {
  return typeViteEnv('VITE_APP_ENV') === 'dev'
}

/**
 * @Author      gx12358
 * @DateTime    2022/4/1
 * @lastTime    2022/4/1
 * @description 环境：正式
 */
export function isPro(): boolean {
  return typeViteEnv('VITE_USE_MODE') === 'pro'
}

/**
 * @Author      gx12358
 * @DateTime    2022/4/1
 * @lastTime    2022/4/1
 * @description 环境：非开发环境
 */
export function isBuild(): boolean {
  return typeViteEnv('VITE_APP_ENV') !== 'dev'
}

/**
 * @Author      gx12358
 * @DateTime    2022/4/1
 * @lastTime    2022/4/1
 * @description 当前联调环境
 */
export function currentMode() {
  return typeViteEnv('VITE_USE_MODE')
}

type ExtendViteEnv<T = undefined> = T extends undefined ? ViteEnv : ViteEnv & T

type ExtendViteEnvKey<T = undefined> = keyof ExtendViteEnv<T>

/**
 * @Author      gx12358
 * @DateTime    2025/11/9
 * @lastTime    2025/11/9
 * @description 推断环境变量
 */
export function typeViteEnv<T = undefined, K extends ExtendViteEnvKey<T> = ExtendViteEnvKey<T>>(key: K): ExtendViteEnv<T>[K] | undefined {
  let value: any = (import.meta as any).env[key]

  if (value && typeof value === 'string') {
    value = value.replace(/\\n/g, '\n') as ExtendViteEnv<T>[K]
    value = value === 'true' ? true : value === 'false' ? false : value
  }

  return value
}
