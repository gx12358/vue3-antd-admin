import type { GImageProps } from '@gx-design-vue/image'
import type { CustomRender, WithFalse } from '@gx-design-vue/pro-utils'
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'
import type { MaterialListItem } from './typings'

export const cardSize: CSSProperties = { width: '104px', height: '104px' }

export interface ExtraMaterialListItem extends MaterialListItem {
  [key: string]: any;
}

export interface OperationRenderProps {
  row: MaterialListItem;
  onView: (row: MaterialListItem) => void;
  onDelete: (row: MaterialListItem) => void;
  onDownload: (row: MaterialListItem) => void;
}

export const proUploadProps = {
  fit: {
    type: String as PropType<GImageProps['fit']>,
    default: 'cover'
  },
  cardClassName: String as PropType<string>,
  triggerClass: String as PropType<string>,
  cardItemClass: String as PropType<string>,
  triggerStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({ ...cardSize })
  },
  cardItemStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({ ...cardSize })
  },
  cardWrapperClass: String as PropType<string>,
  imageStyle: {
    type: Object as PropType<CSSProperties>,
  },
  // 展示形态
  listType: {
    type: String as PropType<'card' | 'normal'>,
    default: () => 'card'
  },
  disabled: Boolean as PropType<boolean>,
  // 是否需要展示封面图（针对不是图片类型）
  isCoverImg: Boolean as PropType<boolean>,
  dataList: {
    type: Array as PropType<(MaterialListItem | string)[]>,
    default: () => []
  },
  // 封面图list，顺序和dataList对应（针对不是图片类型）
  coverDataList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  defaultUploadRender: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  limit: {
    type: Number as PropType<number>,
    default: 15
  },
  // 限制素材类型
  accept: {
    type: [ String ] as PropType<string | null>,
    default: [ 'image/jpeg', 'image/png', 'image/jpg' ].join()
  },
  fileType: {
    type: Array as PropType<string[]>,
    default: () => [ 'jpeg', 'png', 'jpg' ]
  },
  // 限制素材时长 （针对视频，音频类型）
  fileDuration: Number as PropType<number>,
  fileSize: Number as PropType<number>,
  // 是否展示添加水印按钮（针对图片，视频，音频类型）
  waterMark: Boolean as PropType<boolean>,
  // 是否上传之前进行快编操作（针对图片类型）
  multiple: Boolean as PropType<boolean>,
  beforeEditable: Boolean as PropType<boolean>,
  // 是否展示快编图片按钮（针对图片类型）
  showEditor: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  // 是否展示删除按钮
  showDelete: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  // 是否展示下载按钮
  downloadProps: {
    type: [ Boolean, Object ] as PropType<boolean | {
      useLocal?: boolean;
      useFileName?: boolean;
    }>,
    default: false
  },
  // 是否展示预览按钮
  showPreview: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  // 是否展示进度条
  progress: {
    type: Boolean as PropType<boolean>,
    default: undefined
  },
  // 额外添加参数
  dataExtraInfo: {
    type: Array as PropType<ExtraMaterialListItem[]>,
    default: () => []
  },
  bindValue: Boolean as PropType<boolean>,
  // 错误后是否删除该条记录
  errorClean: Boolean as PropType<boolean>,
  wordExtra: {
    type: [ Function, Object, Array, String, Number, Boolean ] as PropType<WithFalse<CustomRender>>,
    default: () => undefined
  },
  fallback: {
    type: [ Function, Object ] as PropType<WithFalse<CustomRender>>,
    default: () => undefined
  },
  placeholder: {
    type: [ Function, Object ] as PropType<WithFalse<CustomRender>>,
    default: () => undefined
  },
  triggerRender: {
    type: [ Function, Boolean ] as PropType<WithFalse<CustomRender>>,
    default: () => undefined
  },
  customOperationRender: {
    type: [ Function, Boolean ] as PropType<WithFalse<(props: OperationRenderProps) => CustomRender>>,
    default: () => undefined
  },
  request: Function as PropType<(file: File, id: string | number, row?: MaterialListItem) => Promise<{ code: number; url: string; previewUrl?: string }>>,
  download: Function as PropType<(props: { url: string; name?: string; }) => Promise<void>>,
  onWaterChange: Function as PropType<(row: MaterialListItem) => Promise<ResponseResult<any, { url: string; }>>>,
  onOpenFileDialog: Function as PropType<() => void>,
  onChangeDownloadLoading: Function as PropType<(loading: boolean) => void>,
  onChange: Function as PropType<(urls: string[], data: MaterialListItem[]) => void>,
  onErrorRequest: Function as PropType<() => void>,
  onDeleteBefore: Function as PropType<(row: MaterialListItem) => void>,
  shape: {
    type: String as PropType<string>,
    default: 'default'
  }
}

export type GUploadProps = Partial<ExtractPropTypes<typeof proUploadProps>>
