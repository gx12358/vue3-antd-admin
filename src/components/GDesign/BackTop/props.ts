import config from '/config/config'
import { PropTypes } from '@/utils'

const { defaultSettings } = config

export default {
  visibilityHeight: PropTypes.number.def(100),
  duration: PropTypes.number.def(450),
  root: PropTypes.string.def(defaultSettings.viewScrollRoot),
  targetStyle: PropTypes.style
}
