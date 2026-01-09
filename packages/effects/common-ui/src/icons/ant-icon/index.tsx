import type { IconBaseType } from '@gx-design-vue/icon'
import type { PropType } from 'vue'
import type { MenuIconType } from './src/menu'
import { defaultIconProps, GIcon as Icon } from '@gx-design-vue/icon'
import { isObject } from '@gx-design-vue/pro-utils'
import { defineComponent } from 'vue'

export type IconType = IconBaseType | MenuIconType

// @ts-ignore
const modules = import.meta.glob('./src/**/index.ts', { eager: true })

export const components = {} as Record<IconType, any>

Object.keys(modules).forEach((key) => {
  const mod = (modules[key] as any).default || {}
  if (isObject(mod)) {
    for (const type in mod) {
      components[type] = mod[type]
    }
  }
})

const GIcon = defineComponent({
  name: 'GIcon',
  inheritAttrs: false,
  props: {
    ...defaultIconProps,
    type: {
      type: String as PropType<IconType>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      return <Icon {...props} type={props.type as any} components={components} />
    }
  }
})

export default GIcon
