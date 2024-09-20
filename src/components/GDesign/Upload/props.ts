import type { CustomRender, WithFalse } from '@gx-design-vue/pro-utils'
import type { MaterialListItem } from './typings'
import { PropTypes } from '@/utils'

export const cardSize: CSSProperties = { width: '104px', height: '104px' }

export const proUploadProps = {
  fit: {
    type: String as VuePropType<'cover' | 'contain' | 'fill' | 'none'>,
    default: 'cover'
  },
  cardClassName: PropTypes.string,
  cardStyle: {
    type: Object as VuePropType<CSSProperties>,
    default: () => ({ ...cardSize })
  },
  cardWrapperClass: String as VuePropType<string>,
  imageStyle: {
    type: Object as VuePropType<CSSProperties>,
  },
  // 展示形态
  listType: {
    type: String as VuePropType<'card' | 'normal'>,
    default: () => 'card'
  },
  disabled: Boolean as VuePropType<boolean>,
  // 是否需要展示封面图（针对不是图片类型）
  isCoverImg: Boolean as VuePropType<boolean>,
  dataList: {
    type: Array as VuePropType<(MaterialListItem | string)[]>,
    default: () => []
  },
  // 封面图list，顺序和dataList对应（针对不是图片类型）
  coverDataList: {
    type: Array as VuePropType<string[]>,
    default: () => []
  },
  defaultUploadRender: {
    type: Boolean as VuePropType<boolean>,
    default: true
  },
  limit: PropTypes.number.def(15),
  // 限制素材类型
  accept: PropTypes.string.def([ 'image/jpeg', 'image/png', 'image/jpg' ].join()),
  fileType: PropTypes.array.def([ 'jpeg', 'png', 'jpg' ]),
  // 限制素材时长 （针对视频，音频类型）
  fileDuration: PropTypes.number,
  fileSize: PropTypes.number,
  // 是否展示添加水印按钮（针对图片，视频，音频类型）
  waterMark: Boolean as VuePropType<boolean>,
  // 是否上传之前进行快编操作（针对图片类型）
  multiple: Boolean as VuePropType<boolean>,
  beforeEditable: Boolean as VuePropType<boolean>,
  // 是否展示快编图片按钮（针对图片类型）
  showEditor: {
    type: Boolean as VuePropType<boolean>,
    default: true
  },
  // 是否展示删除按钮
  showDelete: PropTypes.bool.def(true),
  // 是否展示下载按钮
  showDownload: PropTypes.bool.def(true),
  // 是否展示预览按钮
  showPreview: PropTypes.bool.def(true),
  // 是否展示进度条
  progress: PropTypes.bool.def(true),
  // 额外添加参数
  dataExtraInfo: {
    type: Array as VuePropType<any[]>,
    default: () => []
  },
  bindValue: PropTypes.bool,
  // 错误后是否删除该条记录
  errorClean: PropTypes.bool,
  wordExtra: PropTypes.VueNode,
  fallback: {
    type: [ Function, Object ] as VuePropType<WithFalse<CustomRender>>,
    default: () => undefined
  },
  placeholder: {
    type: [ Function, Object ] as VuePropType<WithFalse<CustomRender>>,
    default: () => undefined
  },
  triggerRender: {
    type: [ Function, Boolean ] as VuePropType<WithFalse<CustomRender>>,
    default: () => undefined
  },
  customOperationRender: {
    type: [ Function, Boolean ] as VuePropType<WithFalse<(view: Fn, download: Fn, remove: Fn) => CustomRender>>,
    default: () => undefined
  },
  request: Function as VuePropType<(file: File, id: string, record?: MaterialListItem) => Promise<{ code: number; url: string; previewUrl: string }>>,
  waterChange: PropTypes.func,
  onOpenFileDialog: PropTypes.func,
  downLoad: PropTypes.func,
  change: PropTypes.func,
  errorRequest: PropTypes.func,
  deleteBefore: PropTypes.func,
  shape: PropTypes.string.def('default')
}
