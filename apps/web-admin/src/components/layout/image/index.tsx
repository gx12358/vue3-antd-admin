import type { GImageProps } from '@gx-design-vue/image'
import type { CustomRender, WithFalse } from '@gx-design-vue/pro-utils'
import type { SlotsType } from 'vue'
import { GImage, imageProps } from '@gx-design-vue/image'
import { getSlotsProps } from '@gx-design-vue/pro-utils'
import { omit } from 'lodash-es'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GlobalImage',
  inheritAttrs: false,
  props: {
    slotClass: {
      type: String as PropType<string>,
    },
    slotImageClass: {
      type: String as PropType<string>,
      default: 'w-30px'
    },
    ...imageProps
  },
  slots: Object as SlotsType<{
    placeholder: GImageProps['placeholder'];
    fallback: GImageProps['fallback'];
    renderHolder: WithFalse<CustomRender>;
  }>,
  setup(props, { slots, attrs }) {
    const renderImage = () => (
      <div class={[ 'gx-image-slot', props.slotClass ]}>
        <img class={props.slotImageClass} src="/src/assets/public_images/placeholder.svg" alt="" />
      </div>
    )
    return () => {
      const slotsProps = getSlotsProps({
        slots,
        props,
        keys: [ 'placeholder', 'fallback', 'renderHolder' ]
      })

      return (
        <GImage
          class={attrs.class || ''}
          style={attrs.style}
          {...omit(props as any, [ 'slotImageClass', 'slotClass' ])}
          fallback={slotsProps.fallback || slotsProps.renderHolder || renderImage()}
          placeholder={slotsProps.placeholder || slotsProps.renderHolder || renderImage()}
        />
      )
    }
  }
})
