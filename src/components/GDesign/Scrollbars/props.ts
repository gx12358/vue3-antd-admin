import type { CSSProperties } from 'vue'
import { isNumber } from '@/utils/validate'

const wrapperKey = Symbol()

export type PropWrapper<T> = { [wrapperKey]: T }

export const definePropType = <T>(val: any) =>
  ({ [wrapperKey]: val } as PropWrapper<T>)

export const scrollbarProps = {
  height: {
    type: [ String, Number ],
    default: ''
  },
  maxHeight: {
    type: [ String, Number ],
    default: ''
  },
  native: {
    type: Boolean,
    default: false
  },
  wrapStyle: {
    type: [String, Array] as PropType<string | CSSProperties[]>,
    default: ''
  },
  wrapClass: {
    type: [ String, Array ],
    default: ''
  },
  viewClass: {
    type: [ String, Array ],
    default: ''
  },
  viewStyle: {
    type: [ String, Array, Object ],
    default: ''
  },
  noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
  tag: {
    type: String,
    default: 'div'
  },
  always: {
    type: Boolean,
    default: false
  },
  minSize: {
    type: Number,
    default: 20
  }
}


export const scrollbarEmits = {
  scroll: ({
    scrollTop,
    scrollLeft
  }: {
    scrollTop: number
    scrollLeft: number
  }) => isNumber(scrollTop) && isNumber(scrollLeft)
}
export type ScrollbarEmits = typeof scrollbarEmits
