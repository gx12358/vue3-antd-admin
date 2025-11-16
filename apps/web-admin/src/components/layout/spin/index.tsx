import type { CSSProperties } from 'vue'
import { useProAppContext } from '@gx-design-vue/pro-app'
import { Spin } from 'ant-design-vue'
import { spinProps } from 'ant-design-vue/es/spin'
import { omit } from 'lodash-es'
import { defineComponent, h } from 'vue'

const GProSpin = defineComponent({
  name: 'GProSpin',
  inheritAttrs: true,
  props: {
    iconStyle: Object as PropType<CSSProperties>,
    ...spinProps()
  },
  setup(props, { slots, attrs }) {
    const { indicator } = useProAppContext()

    return () => {
      const indicatorRender = indicator?.value ? h(indicator?.value as any, {
        style: props.iconStyle
      }) : undefined
      return (
        <Spin
          class={attrs?.class}
          {...omit(props, [ 'iconStyle' ])}
          indicator={props.indicator || indicatorRender}
          v-slots={slots}
        />
      )
    }
  }
})

export default GProSpin
