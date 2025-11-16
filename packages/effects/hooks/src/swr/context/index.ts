import type { PropType } from 'vue'
import type { IConfig } from '../utils'
import { useContext } from '@gx-design-vue/pro-provider'
import { defineComponent } from 'vue'

export const { provideContext: createSwrConfig, useInjectContext: useSwrConfig } = useContext<IConfig>('swr-config', {})

const SwrConfig = defineComponent({
  name: 'SwrConfig',
  props: {
    value: Object as PropType<IConfig>
  },
  setup(props, { slots }) {
    createSwrConfig(props.value || {})
    return () => {
      return slots.default?.()
    }
  }
})

export default SwrConfig
