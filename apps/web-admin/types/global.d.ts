import type {
  DeepPartial,
  ProAliasToken as GProAliasToken,
  RulesState as GRulesState
} from '@gx-design-vue/pro-provider'
import type {
  CustomRenderResult as GCustomRenderResult,
  ProColumnsType as GProColumnsType,
  ProColumnType as GProColumnType,
  ProTableBodyCellProps as GProTableBodyCellProps
} from '@gx-design-vue/pro-table'
import type { Recordable } from '@gx/types'
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface'

declare global {
  type PartialFields<T, K extends keyof T = undefined> = T extends undefined ? T : Omit<T, K> & Partial<Pick<T, K>>
  type RulesState<D> = GRulesState<D>
  type ProAliasToken = DeepPartial<GProAliasToken>
  type ProColumnType<DataValue = any, SearchParama = Recordable> = GProColumnType<
    DataValue,
    SearchParama
  >
  type ProColumnsType<DataValue = any, SearchParama = Recordable> = GProColumnsType<
    DataValue,
    SearchParama
  >
  type ProTableBodyCellProps<T = Record<string, any>> = GProTableBodyCellProps<T>
  type CustomRenderResult<T = Record<string, any>> = GCustomRenderResult<T>
  type AntDataNode = DataNode

  type WithRequired<T, Keys extends keyof T>
    = Required<Pick<T, Keys>>
    & Partial<Omit<T, Keys>>

  interface GlobalViteEnv {
    VITE_BASE_URL: string
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

  interface Window {
    version: string;
  }
}
