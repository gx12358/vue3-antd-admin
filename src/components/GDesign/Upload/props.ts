import { PropTypes } from '@/utils'

import type { UploadList } from './typings'

export const proUploadProps = {
  cardClassName: PropTypes.string,
  uplaodStyle: PropTypes.style,
  imageStyle: PropTypes.style.def({ width: '104px', height: '104px' }),
  // 展示形态 card-卡片形式 button-按钮形式（只有按钮，展现自己实现）
  listType: {
    type: String as PropType<'card' | 'button'>,
    default: 'card'
  },
  // 素材上传禁止状态
  disabled: PropTypes.bool,
  dataList: {
    type: Array as PropType<UploadList>,
    default: () => []
  },
  // 封面图list，顺序和dataList对应（针对不是图片类型）
  coverDataList:{
    type: Array as PropType<string[]>,
    default: () => []
  },
  limit: PropTypes.number.def(15),
  // 限制素材类型
  fileType: PropTypes.array.def([ 'jpeg', 'png', 'jpg' ]),
  // 限制素材时长 （针对视频，音频类型）
  fileDuration: PropTypes.number,
  fileSize: PropTypes.number,
  // 是否展示添加水印按钮（针对图片，视频，音频类型）
  waterMark: PropTypes.bool,
  // 是否上传之前进行快编操作（针对图片类型）
  beforeEditable: PropTypes.bool,
  // 是否自动截取（针对视频类型）
  autoScreenshot: PropTypes.bool.def(true),
  autoGetMediaParams: PropTypes.bool.def(true),
  // 素材展示墙
  viewUp: PropTypes.bool,
  // 是否展示快编图片按钮（针对图片类型）
  editor: PropTypes.bool.def(true),
  // 是否展示删除按钮
  deleteAble: PropTypes.bool.def(true),
  // 是否展示下载按钮
  downLoadAble: PropTypes.bool.def(true),
  // 是否展示进度条
  progress: PropTypes.bool.def(true),
  // 进度条反馈
  progressInfo:  {
    type: Array as PropType<any[]>,
    default: () => []
  },
  // 错误后是否删除该条记录
  errorClean: PropTypes.bool,
  wordExtra: PropTypes.VueNode,
  errorExtra: {
    type:[ Function, Object, String ] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  placeholderExtra: {
    type:[ Function, Object, String ] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  request: PropTypes.func,
  waterChange: PropTypes.func,
  downLoad: PropTypes.func,
  change: PropTypes.func,
  errorRequest: PropTypes.func,
  deleteBefore: PropTypes.func,
  shape: PropTypes.string.def('default')
}
