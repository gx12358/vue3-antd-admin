import { default as PageLoading } from './PageLoading'
import { default as BaseMenu } from './components/SiderMenu/BaseMenu'
import { default as SiderMenuWrapper } from './components/SiderMenu'
import type { PageContainerProps } from './components/PageContainer';
import PageContainer, { ProBreadcrumb } from './components/PageContainer';

export * from './RouteContext'
export * from './typings'
export * from './utils/getMenuData'
export { createContext, useContext } from './hooks/context'
export type { ContextType, CreateContext } from './hooks/context'


export { baseMenuProps } from './components/SiderMenu/props'
export type { BaseMenuProps } from './components/SiderMenu/BaseMenu'
export type { SiderMenuWrapperProps } from './components/SiderMenu'
export type { MenuMode, OpenEventHandler, SelectInfo } from './components/SiderMenu/typings'

export { DefaultHeader } from './components/GlobalHeader/DefaultHeader'
export { default as GlobalFooter } from './components/GlobalFooter'
export { default as SettingDrawer } from './components/SettingDrawer'
export { WrapContent } from './WrapContent'

export type { DefaultHeaderProps } from './components/GlobalHeader/DefaultHeader'
export type { GlobalFooterProps } from './components/GlobalFooter'

export type { ProSettings } from './defaultSettings'

export { default } from './BasicLayout'

export type { BasicLayoutProps } from './BasicLayout'

export {
  BaseMenu,
  PageLoading,
  SiderMenuWrapper,
  PageContainer,
  ProBreadcrumb,
}

export type {
  PageContainerProps
}
