declare type Recordable<T = any> = Record<string, T>

declare interface GlobalViteEnv {
  VITE_BASE_URL: string
  VITE_IS_MOCK: boolean
  VITE_IP_ADRESS: string
  VITE_USE_PWA: boolean
  VITE_UPLOAD_PATH: string
  VITE_PROXY_PREFIX: string
  VITE_DROP_CONSOLE: boolean
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
  VITE_LEGACY: boolean
  VITE_HOME_PAGE: string // 主页
  VITE_HOME_PAGE_DOC: string; // 系统文档
  VITE_GITHUB_PAGE: string; // github 地址
  VITE_GITEE_PAGE: string; // gitee 地址
}

declare interface Window {
  version: string;
}
