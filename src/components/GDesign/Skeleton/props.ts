import { PropTypes } from '@/utils'
import { tuple } from '@gx-design/utils'

export default {
  type: PropTypes.oneOf(tuple('button', 'avatar', 'input', 'image')).def('button'),
  loading: PropTypes.looseBool,
  active: PropTypes.looseBool,
  size: {
    type: [ String, Number ] as PropType<string | number>,
    default: 'default'
  },
  shape: {
    type: [ String, Number ] as PropType<string | number>,
    default: 'default'
  },
  width: [ String, Number ] as PropType<string | number>,
  propsStyle: PropTypes.style
}
