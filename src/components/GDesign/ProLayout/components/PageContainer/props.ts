import { pageHeaderProps } from 'ant-design-vue/es/page-header'
import { PropTypes } from '@/utils'
import type { DefaultPropRender, PageHeaderRender } from '../../RenderTypings'

export const pageContainerProps = {
  ...pageHeaderProps(),
  title: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  subTitle: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  content: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  extraContent: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  header: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  footer: {
    type: [Object, String, Boolean, Function] as PropType<DefaultPropRender>,
    default: () => null,
  },
  pageHeaderRender: {
    type: [Object, Function, Boolean] as PropType<PageHeaderRender>,
  },
  prefixCls: {
    type: String,
    default: 'gx-pro',
  },
  contentStyle: PropTypes.style,
  useCard: PropTypes.bool.def(true),
  ghost: {
    type: Boolean,
    default: () => undefined,
  },
  loading: {
    type: Boolean,
    default: () => undefined,
  },
}
