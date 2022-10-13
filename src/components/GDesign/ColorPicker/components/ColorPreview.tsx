import { defineComponent } from 'vue'
import { ColorPickerMode, convertColor, getModeFromValue } from '../utils'

export default defineComponent({
  name: 'ColorPreview',
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    mode: {
      type: String as PropType<ColorPickerMode>,
      required: true
    },
    color: {
      type: String as PropType<string | null>,
      default: null,
      validator: (value: string) => {
        const mode = getModeFromValue(value)
        return Boolean(!value || (mode && mode !== 'hsv'))
      }
    },
    onUpdateColor: {
      type: Function as PropType<(value: string) => void>,
      required: true
    }
  },
  setup(props) {
    function handleChange(e: Event): void {
      // hex
      const value = (e.target as HTMLInputElement).value
      props.onUpdateColor?.(convertColor(value.toUpperCase(), props.mode, 'hex'))
      e.stopPropagation()
    }

    return {
      handleChange
    }
  },
  render() {
    const { clsPrefix } = this
    return (
      <div class={`${clsPrefix}-picker-preview-preview`}>
        <span
          class={`${clsPrefix}-picker-preview-fill`}
          style={{
            background: this.color || '#000000'
          }}
        />
        <input
          class={`${clsPrefix}-picker-preview-input`}
          type="color"
          value={this.color}
          onChange={this.handleChange}
        />
      </div>
    )
  }
})
