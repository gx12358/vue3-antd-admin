import { PropTypes } from '@/utils'
import type { VideoSource } from './typings'

export const videoProps = {
  loop: PropTypes.bool.def(false),
  muted: PropTypes.bool.def(false),
  autoplay: PropTypes.bool.def(true),
  playsinline: PropTypes.bool.def(false),
  src: [ Array, String ] as VuePropType<string | VideoSource[]>,
}
