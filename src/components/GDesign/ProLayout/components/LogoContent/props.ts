import type { CSSProperties } from 'vue'
import { PropTypes } from '@/utils'
import { defaultSettingProps } from '../../defaultSettings'
import type { HeaderLogoRender } from '../../RenderTypings'

export default {
  renderKey: PropTypes.string.def('menuHeaderRender'),
  title: defaultSettingProps.title,
  layout: defaultSettingProps.layout,
  logo: {
    type: [ Object, String, Function ] as PropType<CustomRender>,
    default: () => undefined
  },
  logoStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => undefined
  },
  logoDirection: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal'
  },
  drawer: PropTypes.looseBool,
  collapsed: PropTypes.looseBool,
  menuHeaderRender: {
    type: [ Object, Function ] as PropType<HeaderLogoRender>,
    default: () => undefined
  },
  onMenuHeaderClick: PropTypes.func
}
