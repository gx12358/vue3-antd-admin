import type { GImageProps } from '@gx-design-vue/image'
import type {
  CustomRender,
  SemanticClassNames,
  SemanticStyles,
  WithFalse
} from '@gx-design-vue/pro-utils'
import type { PropType, SlotsType } from 'vue'
import { GImage, imageProps } from '@gx-design-vue/image'
import { classNames, getSlotsProps } from '@gx-design-vue/pro-utils'
import { GIcon } from '@gx/design'
import { defineComponent } from 'vue'
import { isLink } from '@/utils/util'

export type MenuIconSemanticName = 'root' | 'icon'

export type MenuIconStylesType = SemanticStyles<MenuIconSemanticName>

export type MenuIconClassNamesType = SemanticClassNames<MenuIconSemanticName>

const GlobalImage = defineComponent({
  name: 'MenuIcon',
  inheritAttrs: false,
  props: {
    slotClass: {
      type: String as PropType<string>
    },
    slotImageClass: {
      type: String as PropType<string>,
      default: 'w-30px'
    },
    styles: {
      type: Object as PropType<MenuIconStylesType>
    },
    classNames: {
      type: Object as PropType<MenuIconClassNamesType>
    },
    ...imageProps
  },
  slots: Object as SlotsType<{
    placeholder: GImageProps['placeholder'];
    fallback: GImageProps['fallback'];
    renderHolder: WithFalse<CustomRender>;
  }>,
  setup(props, { slots }) {
    const imageType = computed(() => isLink(props.src) ? 'image' : 'icon')

    const renderImage = () => (
      <div class={[ 'bg-hex-fafafa w-full h-full', props.slotClass ]} />
    )

    return () => {
      const slotsProps = getSlotsProps({
        slots,
        props,
        keys: [ 'placeholder', 'fallback', 'renderHolder' ]
      })

      return (
        <div style={props.styles?.root} class={classNames(props.classNames?.root, 'flex')}>
          {
            imageType.value === 'image'
              ? (
                <GImage
                  class={classNames('w-full h-full', props.classNames?.icon)}
                  src={props.src}
                  style={props.styles?.icon}
                  fallback={slotsProps.fallback || slotsProps.renderHolder || renderImage()}
                  placeholder={slotsProps.placeholder || slotsProps.renderHolder || renderImage()}
                />
              )
              : <GIcon type={props.src as any} class={props.classNames?.icon} style={props.styles?.icon} />
          }
        </div>
      )
    }
  }
})

export default GlobalImage
