export * from './basic'
export * from './request'
export * from './user'

export type Recordable<T = any> = Record<string, T>

export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export interface ViteEnv {
  VITE_USE_MODE: 'development' | 'production' | 'pro'
  VITE_NODE_ENV: 'development' | 'production'
  VITE_APP_ENV: 'dev' | 'pro'
  VITE_APP_VERSION: string
}
