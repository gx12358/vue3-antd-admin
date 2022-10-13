import type { BreadcrumbProps } from './RouteContext'
import type { ProProps } from './typings'

// Custom render or slot
export type DefaultPropRender = WithFalse<CustomRender>

export type BreadcrumbRender = BreadcrumbProps['itemRender']
export type HeaderContentRender = WithFalse<() => CustomRender>
export type HeaderRender = WithFalse<(props: ProProps) => CustomRender>
export type FooterRender = WithFalse<(props: ProProps) => CustomRender>
export type RightContentRender = WithFalse<(props: ProProps) => CustomRender>
export type MenuItemRender = WithFalse<
  (args: { item: AppRouteModule; title?: JSX.Element; icon?: JSX.Element }) => CustomRender
>
export type SubMenuItemRender = WithFalse<(args: { item: AppRouteModule; children?: CustomRender[] }) => CustomRender>
export type LinksRender = WithFalse<CustomRender>
export type MenuContentRender = WithFalse<(props: ProProps, defaultDom: CustomRender) => CustomRender>
export type MenuFooterRender = WithFalse<(props?: ProProps) => CustomRender>
export type MenuExtraRender = WithFalse<(props?: ProProps) => CustomRender>
export type LogoRender = WithFalse<CustomRender>
export type ExtraRightDropdownRender = WithFalse<CustomRender>
export type HeaderLogoRender = WithFalse<(
  logo: CustomRender,
  title: CustomRender,
  props?: ProProps
) => CustomRender>
export type CopyrightRender = WithFalse<CustomRender>

export type CollapsedButtonRender = WithFalse<(collapsed?: boolean) => CustomRender>

export type PageHeaderRender = WithFalse<(props?: ProProps) => CustomRender>
