import config from '/config/config'
import { PropTypes } from '@/utils'

const { waterMarkTitle } = config.defaultSettings

export const waterMarkProps = {
  className: PropTypes.string,
  style: PropTypes.style,
  markStyle: PropTypes.style,
  markClassName: PropTypes.string,
  gapX: PropTypes.number.def(212),
  gapY: PropTypes.number.def(212),
  zIndex: PropTypes.number.def(9),
  width: PropTypes.number.def(120),
  height: PropTypes.number.def(64),
  offsetTop: PropTypes.number,
  offsetLeft: PropTypes.number,
  rotate: PropTypes.number.def(-22),
  image: PropTypes.string,
  content: {
    type: String,
    default: waterMarkTitle || 'GX Pro Admin'
  },
  fontColor: PropTypes.string.def('rgba(0,0,0,.15)'),
  fontStyle: {
    type: String as PropType<'none' | 'normal' | 'italic' | 'oblique'>,
    default: 'normal'
  },
  fontFamily: PropTypes.string.def('sans-serif'),
  fontWeight: {
    type: [ String, Number ] as PropType<'normal' | 'light' | 'weight' | number>,
    default: 'normal'
  },
  fontSize: {
    type: [ String, Number ] as PropType<string | number>,
    default: 16
  }
}
