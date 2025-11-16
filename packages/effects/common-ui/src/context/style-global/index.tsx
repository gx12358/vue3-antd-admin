import type { ModulesStyles } from '@gx/hooks'
import type { PropType, SlotsType } from 'vue'
import { useGlobalIconStyle } from '@gx/hooks'
import { defineComponent, toRef } from 'vue'

const StyleGlobalContext = defineComponent({
  name: 'StyleGlobalContext',
  inheritAttrs: false,
  props: {
    modules: {
      type: Array as PropType<ModulesStyles>,
      default: () => []
    }
  },
  slots: Object as SlotsType<{
    default(): void
  }>,
  setup(props, { slots }) {
    useGlobalIconStyle(toRef(props, 'modules'))

    return () => {
      return slots.default?.()
    }
  }
})

export default StyleGlobalContext
