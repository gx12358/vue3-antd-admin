import { computed, defineComponent } from 'vue'
import { HSLA, toHslaString } from '../seemly'

export default defineComponent({
  name: 'ColorPickerTrigger',
  props: {
    size: String as PropType<'small' | 'middle' | 'large'>,
    clsPrefix: {
      type: String,
      required: true
    },
    value: {
      type: String as PropType<string | null>,
      default: null
    },
    hsla: {
      type: Array as unknown as PropType<HSLA | null>,
      default: null
    },
    onClick: Function as PropType<() => void>
  },
  setup(props) {
    const heightRef = computed(() =>
      props.size === 'small' ? 14 : props.size === 'middle' ? 22 : 30
    )

    return () => {
      const { hsla, clsPrefix, onClick } = props
      return (
        <div
          data-target="color-picker"
          class={`${clsPrefix}-picker-trigger`}
          onClick={(_) => onClick()}
        >
          <div data-target="color-picker" class={`${clsPrefix}-picker-trigger-fill`}>
            <div data-target="color-picker" class={`${clsPrefix}-picker-checkboard`} />
            <div
              data-target="color-picker"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: hsla ? toHslaString(hsla) : '',
                height: `${heightRef.value}px`
              }}
            />
          </div>
        </div>
      )
    }
  }
})
