import type { GImageProps } from '@gx-design-vue/image'
import type { CustomRender, WithFalse } from '@gx-design-vue/pro-utils'
import type { ResponseResult } from '@gx/types/request'
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'
import type { MaterialListItem } from './typings'

export interface ExtraMaterialListItem extends MaterialListItem {
  [key: string]: any;
}

export interface UploadRequestResult {
  code: number;
  data: Partial<MaterialListItem>;
  message?: string;
}

export interface OperationRenderProps {
  row: MaterialListItem;
  onView: (row: MaterialListItem) => void;
  onDelete: (row: MaterialListItem) => void;
  onDownload: (row: MaterialListItem) => void;
}

export interface UploadCardProps {
  id?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  className?: string;
  borderRadius?: number;
  renderClassName?: string;
  renderStyle?: CSSProperties;
  wrapperClassName?: string;
  fit: GImageProps['fit']
}

export interface LimitProps {
  size?: number | ((file: File) => boolean)
  type?: '*' | ((file: File) => boolean) | string[];
  duration?: number | ((file: File) => boolean);
  message?: string | ((type: 'type' | 'size' | 'duration', file: File) => string);
}

export const proUploadProps = {
  list: {
    type: Array as PropType<(MaterialListItem | string)[]>,
    default: () => []
  },
  coverList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  listType: {
    type: String as PropType<'card' | 'default'>,
    default: () => 'card'
  },
  cardProps: {
    type: Object as PropType<UploadCardProps>,
    default: () => ({
      width: 100,
      height: 100,
      borderRadius: 8,
      fit: 'contain'
    } as UploadCardProps)
  },
  wrapperClassName: String as PropType<string>,
  triggerClass: String as PropType<string>,
  triggerStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  disabled: Boolean as PropType<boolean>,
  uploadSelectRender: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  maxCount: {
    type: Number as PropType<number>,
  },
  // 限制素材类型
  accept: {
    type: [ String ] as PropType<string | null>,
    default: [ 'image/jpeg', 'image/png', 'image/jpg' ].join()
  },
  limit: {
    type: Object as PropType<LimitProps | ((file: File) => Promise<boolean> | boolean)>,
    default: () => ({
      type: '*'
    } as LimitProps)
  },
  actions: {
    type: Object as PropType<{
      view: WithFalse<(props: MaterialListItem) => CustomRender>;
      delete: WithFalse<(props: MaterialListItem) => CustomRender>;
      download: WithFalse<(props: MaterialListItem) => CustomRender>;
    }>,
    default: () => {
      return {
        view: true,
        delete: true,
        download: true
      }
    }
  },
  progress: {
    type: [Boolean, Function, Object] as PropType<WithFalse<(row: MaterialListItem) => CustomRender>>,
    default: undefined
  },
  /**
   * @Author      gx12358
   * @DateTime    2025/11/23
   * @lastTime    2025/11/23
   * @description 额外添加参数
   */
  dataExtraInfo: {
    type: Array as PropType<ExtraMaterialListItem[]>,
    default: () => []
  },
  /**
   * @Author      gx12358
   * @DateTime    2025/11/23
   * @lastTime    2025/11/23
   * @description 错误后是否删除该条记录
   */
  errorClean: Boolean as PropType<boolean>,
  // function
  request: Function as PropType<(file: File, row: MaterialListItem) => Promise<UploadRequestResult>>,
  createFileName: Function as PropType<(row: MaterialListItem) => string>,
  download: Function as PropType<(props: { url: string; name?: string; }) => Promise<void>>,
  onWaterChange: Function as PropType<(row: MaterialListItem) => Promise<ResponseResult<any, { url: string; }>>>,
  onOpenFileDialog: Function as PropType<() => void>,
  onChangeLoading: Function as PropType<(loading: boolean) => void>,
  onChange: Function as PropType<(urls: string[], data: MaterialListItem[]) => void>,
  onErrorRequest: Function as PropType<(result: UploadRequestResult) => void>,
  onDeleteBefore: Function as PropType<(row: MaterialListItem) => void>,
  shape: {
    type: String as PropType<'circle' | 'default'>,
    default: 'default'
  },
  fallback: {
    type: [ Function, Object ] as PropType<WithFalse<(props: MaterialListItem) => CustomRender>>,
    default: () => undefined
  },
  placeholder: {
    type: [ Function, Object ] as PropType<WithFalse<(props: MaterialListItem) => CustomRender>>,
    default: () => undefined
  },
  triggerIcon: {
    type: [ Function, Boolean ] as PropType<WithFalse<CustomRender>>,
    default: () => undefined
  },
  dropdownMenu: {
    type: [ Function, Boolean ] as PropType<WithFalse<(props: MaterialListItem) => CustomRender>>,
    default: () => undefined
  },
  actionsRender: {
    type: [ Function, Boolean ] as PropType<WithFalse<(props: OperationRenderProps) => CustomRender>>,
    default: () => undefined
  },
}

export type GUploadProps = Partial<ExtractPropTypes<typeof proUploadProps>>
