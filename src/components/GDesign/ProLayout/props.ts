import type { CSSProperties } from 'vue'
import { PropTypes } from '@/utils'
import type { BreadcrumbProps } from './RouteContext'
import type { FooterRender, CopyrightRender } from './RenderTypings'
import type { Links } from './components/GlobalFooter'
import { defaultSettingProps } from './defaultSettings'
import { globalHeaderProps, headerViewProps } from './components/GlobalHeader/props'
import { siderMenuProps } from './components/SiderMenu/props'
import multiTabProps from './components/MultiTab/props'
import { defaultLinks } from './components/GlobalFooter'

export const basicLayoutProps = {
  ...defaultSettingProps,
  ...globalHeaderProps,
  ...siderMenuProps,
  ...headerViewProps,
  ...multiTabProps,

  pure: Boolean,
  /**
   * 是否禁用移动端模式，有的管理系统不需要移动端模式，此属性设置为true即可
   */
  disableMobile: {
    type: Boolean,
    required: false,
  },
  contentStyle: {
    type: [String, Object] as PropType<CSSProperties>,
    default: () => {
      return null
    },
  },
  breadcrumb: {
    type: [Object, Function] as PropType<BreadcrumbProps>,
    default: () => null,
  },
  disableContentMargin: PropTypes.looseBool,
  isChildrenLayout: PropTypes.looseBool,
  loading: PropTypes.looseBool,
  footerLinks: {
    type: [Array, Boolean] as PropType<Links>,
    default: defaultLinks
  },
  copyrightRender: {
    type: [Object, Function, Boolean, String] as PropType<CopyrightRender>,
    default: () => undefined,
  },
  footerRender: {
    type: [Object, Function, Boolean] as PropType<FooterRender>,
    default: () => undefined,
  },
  menuData: {
    type: Array as PropType<AppRouteModule[]>,
    default: () => []
  },
  collapsed: PropTypes.looseBool
}
