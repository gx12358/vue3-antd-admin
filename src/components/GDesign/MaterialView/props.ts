import { PropTypes } from '@/utils'

export const gMaterialViewProps = {
  type: PropTypes.string,
  url: {
    type: [ String, Array ] as VuePropType<string | string[]>
  },
  visible: PropTypes.bool,
  playerStyle: PropTypes.style,
  config: PropTypes.object,
  onChange: {
    type: Function as VuePropType<(visible: boolean) => void>
  },
}
