import type { FunctionalComponent } from 'vue'
import { computed, defineComponent } from 'vue'
import { Tooltip, ConfigProvider } from 'ant-design-vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { PropTypes } from '@/utils'

const ThemeColorProps = {
  title: PropTypes.string,
  value: PropTypes.string,
  colors: PropTypes.array,
  className: PropTypes.string
}

const Tag: FunctionalComponent<{ color: string; check: boolean; className: string }> = ({
  color,
  check,
  className
}) => {
  return (
    <div class={`${className}-block`} style={{ backgroundColor: color }}>
      {check ? <CheckOutlined /> : null}
    </div>
  )
}

const ThemeColor = defineComponent({
  props: ThemeColorProps,
  emits: ['change'],
  setup(props, { emit }) {
    const baseClassName = computed(() => `${props.className}-theme-color`)

    const handleChange = (key: string) => {
      emit('change', key)
      ConfigProvider.config({
        theme: {
          primaryColor: key
        }
      })
    }

    return () => {
      const { value, title, colors = [], className } = props
      return (
        <div class={baseClassName.value} style={{ marginBottom: '24px' }}>
          <h3 class={`${className}-title`}>{title}</h3>
          <div class={`${baseClassName.value}-content`}>
            {colors.map((item: any) => {
              const check = value === item.color
              return (
                <Tooltip key={item.color} title={item.fileName}>
                  <Tag
                    className={className}
                    class={`${baseClassName.value}-block`}
                    color={item.color}
                    check={check}
                    onClick={() => handleChange(item.color)}
                  />
                </Tooltip>
              )
            })}
          </div>
        </div>
      )
    }
  }
})

export default ThemeColor
