import type { InjectionKey, Ref, ComputedRef } from 'vue'
import { provide, reactive } from 'vue'
import { themeConfig } from '/types/config'
import type { prefixCls } from '@gx-admin/utils'
import { getPrefixCls } from '@gx-admin/utils'
import { createContext, useContext } from './hooks/context'

export interface Route {
  path: string
  breadcrumbName: string
  children?: Omit<Route, 'children'>[]
}

export interface BreadcrumbProps {
  prefixCls?: string
  routes?: Route[]
  params?: any
  separator?: CustomRender
  itemRender?: (opts: {
    route: Route
    params: any
    routes: Array<Route>
    paths: Array<string>
  }) => CustomRender
}

export type BreadcrumbListReturn = Pick<
  BreadcrumbProps,
  Extract<keyof BreadcrumbProps, 'routes' | 'itemRender'>
>

export interface MenuState {
  selectedKeys: string[]
  openKeys: string[]
  setSelectedKeys?: (key: string[]) => void
  setOpenKeys?: (key: string[]) => void
}

export interface RouteContextProps extends Partial<themeConfig>, MenuState {
  menuData: AppRouteModule[]
  flatMenuData?: AppRouteModule[]

  getPrefixCls?: (prefixCls: prefixCls) => string
  breadcrumb?: BreadcrumbListReturn | ComputedRef<BreadcrumbListReturn>
  hasContentWide?: boolean
  isMobile?: boolean
  prefixCls?: string
  collapsed?: boolean
  hasSideMenu?: boolean
  hasHeader?: boolean
  siderWidth?: number
  headerHeight?: number
  hasFooterToolbar?: boolean
  hasFooter?: boolean
  hasSide?: boolean
  setHasFooterToolbar?: (bool: boolean) => void
  /* 附加属性 */
  [key: string]: any
}

// set default context
export const defaultRouteContext = reactive({
  getPrefixCls
})

const routeContextInjectKey: InjectionKey<RouteContextProps> = Symbol('route-context')

export const createRouteContext = () =>
  createContext<RouteContextProps>(routeContextInjectKey, 'RouteContext.Provider')

export const provideRouteContext = (value: RouteContextProps | Ref<RouteContextProps> | any) => {
  provide(routeContextInjectKey, value)
}

export const useRouteContext = () =>
  useContext<Required<RouteContextProps>>(routeContextInjectKey, defaultRouteContext)

const Provider = createRouteContext()

export default {
  Provider
}
