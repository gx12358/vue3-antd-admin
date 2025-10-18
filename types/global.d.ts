import type { DeepPartial, ProAliasToken as GProAliasToken, RulesState as GRulesState } from '@gx-design-vue/pro-provider'
import type {
  CustomRenderResult as GCustomRenderResult,
  ProColumnsType as GProColumnsType,
  ProColumnType as GProColumnType,
  ProTableBodyCellProps as GProTableBodyCellProps
} from '@gx-design-vue/pro-table'
import type { RecordType } from '@gx-design-vue/pro-utils'

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
    lastBuildTime: string
  }

  declare type LocalStorage = 'localStorage' | 'sessionStorage' | 'cookie'
  declare type RulesState<D> = GRulesState<D>
  declare type ProAliasToken = DeepPartial<GProAliasToken>
  declare type ProColumnType<DataValue = any, SearchParama = RecordType> = GProColumnType<
    DataValue,
    SearchParama
  >
  declare type ProColumnsType<DataValue = any, SearchParama = RecordType> = GProColumnsType<
    DataValue,
    SearchParama
  >
  declare type ProTableBodyCellProps<T = Record<string, any>> = GProTableBodyCellProps<T>
  declare type CustomRenderResult<T = Record<string, any>> = GCustomRenderResult<T>

  declare type Recordable<T = any> = Record<string, T>

  declare interface Fn<T = any, R = T> {
    (...arg: T[]): R
  }

  declare interface ViteEnv {
    VITE_IP_ADRESS: string
    VITE_USE_MODE: 'development' | 'production' | 'pro'
    // proxy 配置
    VITE_PROXY_PREFIX: string
    // 全局 mock 开关
    VITE_IS_MOCK: boolean
    VITE_USE_MOCK: boolean
    VITE_NODE_ENV: 'development' | 'production'
    VITE_USE_PWA: boolean
    VITE_BASE_URL: string
    VITE_UPLOAD_PATH: string
    VITE_APP_ENV: 'dev' | 'pro'
    VUE_APP_VERSION: string
    VITE_PROXY: [ string, string ][]
    VITE_DROP_CONSOLE: boolean
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
    VITE_LEGACY: boolean
    VITE_HOME_PAGE: string // 主页
    VITE_HOME_PAGE_DOC: string; // 系统文档
    VITE_GITHUB_PAGE: string; // github 地址
    VITE_GITEE_PAGE: string; // gitee 地址
  }

  interface Window {
    version: string;
    editorConfig: {
      isFirstRenderCropUpdated?: boolean
    }
    FilerobotImageEditor?: any
  }
}
