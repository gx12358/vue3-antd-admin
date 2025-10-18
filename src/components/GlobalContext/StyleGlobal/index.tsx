import type { SlotsType } from 'vue'
import { useGlobalIconStyle } from '@gx-admin/hooks/web'
import { defineComponent } from 'vue'

const StyleGlobal = defineComponent({
  name: 'StyleGlobal',
  inheritAttrs: false,
  slots: Object as SlotsType<{
    default(): void
  }>,
  setup(_, { slots }) {
    useGlobalIconStyle()

    return () => {
      return slots.default?.()
    }
  }
})

export default StyleGlobal
