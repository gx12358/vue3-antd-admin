import type { GImageProps } from '@gx-design-vue/image'
import type { CustomRender, WithFalse } from '@gx-design-vue/pro-utils'
import type { SlotsType } from 'vue'
import { GImage, imageProps } from '@gx-design-vue/image'
import { getSlotVNode } from '@gx-design-vue/pro-utils'
import { omit } from 'lodash-es'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GlobalImage',
  inheritAttrs: false,
  props: {
    slotClass: {
      type: String as VuePropType<string>,
    },
    slotImageClass: {
      type: String as VuePropType<string>,
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
      const placeholderSlot = getSlotVNode<WithFalse<CustomRender>>(slots, props, 'placeholder')
      const fallbackSlot = getSlotVNode<WithFalse<CustomRender>>(slots, props, 'fallback')
      const renderHolder = getSlotVNode<WithFalse<CustomRender>>(slots, props, 'renderHolder')

      return (
        <GImage
          class={attrs.class || ''}
          style={attrs.style}
          {...omit(props, [ 'slotImageClass', 'slotClass' ])}
          fallback={fallbackSlot || renderHolder || renderImage()}
          placeholder={placeholderSlot || renderHolder || renderImage()}
        />
      )
    }
  }
})
