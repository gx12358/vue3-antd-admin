import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'

export interface MediaListItem {
  url: string;
  name?: string;
  cover?: string;
}

export const mediaViewProps = {
  /**
   * @Author      gx12358
   * @DateTime    2025/11/23
   * @lastTime    2025/11/23
   * @description 媒体类型 1 图片 2 音频 3 视频
   */
  type: String as PropType<'1' | '2' | '3'>,
  list: {
    type: [ Array ] as PropType<MediaListItem[]>
  },
  open: Boolean as PropType<boolean>,
  'onUpdate:open': Function as PropType<(open: boolean) => void>,
  playerStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  playerClass: {
    type: String as PropType<string>
  },
  config: Object as PropType<any>,
  onChange: {
    type: Function as PropType<(visible: boolean) => void>
  },
}

export type GMediaViewProps = Partial<ExtractPropTypes<typeof mediaViewProps>>
