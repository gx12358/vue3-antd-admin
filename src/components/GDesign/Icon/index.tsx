import type { IconType } from './components'
import Icon from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
import { Components } from './components'

export default defineComponent<{
  type?: IconType;
  spin?: boolean;
}>({
  name: 'GIcon',
  props: {
    type: String as PropType<IconType>,
    spin: Boolean as PropType<boolean>,
  },
  setup(props) {
    return () => {
      if (!props.type) return null
      return <Icon spin={props.spin} component={Components[props.type]} />
    }
  },
})
