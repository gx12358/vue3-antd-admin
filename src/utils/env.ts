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
 * @description 环境：非本地开发环境
 */
export function isBuild(): boolean {
  return typeViteEnv('VITE_NODE_ENV') === 'production'
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

export function typeViteEnv<T extends keyof ViteEnv>(key: T): ViteEnv[T] | undefined {
  let value: any = (import.meta as any).env[key]

  if (value && typeof value === 'string') {
    value = value.replace(/\\n/g, '\n') as ViteEnv[T]
    value = value === 'true' ? true : value === 'false' ? false : value
  }

  return value
}
