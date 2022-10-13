import { PropTypes } from '@/utils'

export const gImagePorps = {
  appendToBody: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  hideOnClickModal: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  src: {
    type: String as PropType<string>,
    default: ''
  },
  fit: {
    type: String as PropType<string>,
    default: ''
  },
  lazy: PropTypes.bool,
  scrollContainer: {
    type: [String, Object] as PropType<string | HTMLElement | undefined>,
  },
  placeholder: {
    type: [ Function, Object ] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  fallback: {
    type: [ Function, Object ] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  onError: {
    type: Function as PropType<(e: Error) => void>
  },
  onClick: {
    type: Function as PropType<(info: any) => void>
  },
  disablePreview: PropTypes.bool,
  previewSrcList: {
    type: Array as PropType<string[]>,
    default: () => [] as string[]
  },
  width: PropTypes.number,
  height: PropTypes.number,
  zIndex: {
    type: Number as PropType<number>,
    default: 2000
  }
}

export const gImageViewProps = {
  urlList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  zIndex: gImagePorps.zIndex,
  initialIndex: {
    type: Number as PropType<number>,
    default: 0
  },
  infinite: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  onHideOnClickModal: gImagePorps.hideOnClickModal
}
