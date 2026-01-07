import type { CSSProperties } from 'vue'
import { useProAppContext } from '@gx-design-vue/pro-app'
import { isArray } from '@gx-design-vue/pro-utils'
import { Spin } from 'ant-design-vue'
import { spinProps } from 'ant-design-vue/es/spin'
import { omit } from 'lodash-es'
import { defineComponent, h } from 'vue'

const GSpin = defineComponent({
  name: 'GSpin',
  inheritAttrs: true,
  props: {
    iconStyle: Object as PropType<CSSProperties>,
    ...spinProps()
  },
  setup(props, { slots, attrs }) {
    const { indicator } = useProAppContext()

    return () => {
      const indicatorChildren: any = isArray(indicator.value) ? indicator.value[0] : indicator.value
      const indicatorRender = indicator?.value ? h(indicatorChildren, {
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

export default GSpin
