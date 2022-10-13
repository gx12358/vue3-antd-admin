import { PropTypes } from '@/utils'
import type { OnUpdateValue, MaybeArray } from '@gx-design/utils'
import type { ColorPickerMode, ActionType } from './typings'

export const colorPickerPanelProps = {
  value: String,
  readonly: PropTypes.bool,
  show: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  defaultShow: {
    type: Boolean,
    default: false
  },
  defaultValue: String as PropType<string | null>,
  modes: {
    type: Array as PropType<ColorPickerMode[]>,
    default: [ 'rgb', 'hex', 'hsl' ]
  },
  to: {
    type: [ String, Object, Boolean ] as PropType<HTMLElement | string | boolean>,
    default: undefined
  },
  showAlpha: {
    type: Boolean,
    default: true
  },
  showPreview: Boolean,
  swatches: Array as PropType<string[]>,
  actions: {
    type: Array as PropType<ActionType[]>,
    default: null
  },
  internalActions: Array as PropType<ReadonlyArray<'redo' | 'undo'>>,
  size: String as PropType<'small' | 'middle' | 'large'>,
  onComplete: Function as PropType<OnUpdateValue>,
  'onUpdate:show': [ Function, Array ] as PropType<MaybeArray<(value: boolean) => void>>,
  onUpdateShow: [ Function, Array ] as PropType<MaybeArray<(value: boolean) => void>>,
  'onUpdate:value': [ Function, Array ] as PropType<MaybeArray<OnUpdateValue>>,
  onChange: [ Function, Array ] as PropType<MaybeArray<OnUpdateValue>>
}
