import type { SlotsType } from 'vue'
import { defineComponent } from 'vue'
import type { WithFalse, CustomRender } from '@gx-design-vue/pro-utils'
import { getSlotVNode } from '@gx-design-vue/pro-utils'
import { GImage, gImagePorps } from '@gx-design-vue/image'

export default defineComponent({
  name: 'GlobalImage',
  inheritAttrs: false,
  props: {
    slotImageClass: {
      type: String as VuePropType<string>,
      default: 'w-30px'
    },
    ...gImagePorps
  },
  slots: Object as SlotsType<{
    placeholder: any;
    fallback: any;
    renderHolder: any;
  }>,
  setup(props, { slots, attrs }) {
    const renderImage: () => any = () => (
      <div class={'gx-image-slot'}>
        <img class={props.slotImageClass} src="/src/assets/public_images/placeholder.svg" alt="" />
      </div>
    )
    return () => {
      const placeholderSlot = getSlotVNode<WithFalse<() => CustomRender>>(slots, props, 'placeholder')
      const fallbackSlot = getSlotVNode<WithFalse<() => CustomRender>>(slots, props, 'fallback')
      const renderHolder = getSlotVNode<WithFalse<() => CustomRender>>(slots, props, 'renderHolder')

      return (
        <GImage
          class={attrs.class || ''}
          style={attrs.style}
          {...props}
          fallback={fallbackSlot || renderHolder || renderImage()}
          placeholder={placeholderSlot || renderHolder || renderImage()}
        />
      )
    }
  }
})
