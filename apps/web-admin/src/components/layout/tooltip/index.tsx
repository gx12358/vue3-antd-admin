import type { PropType } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { tooltipProps } from 'ant-design-vue/es/tooltip'
import { omit } from 'lodash-es'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    ...tooltipProps(),
    isShort: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    parentNodeLevel: {
      type: Number as PropType<0 | 1 | 2 | 3 | -1>,
      default: 1
    }
  },
  setup(props, { slots }) {
    return () => {
      return (
        <>
          {
            props.isShort ? slots.default?.() : (
              <Tooltip
                getPopupContainer={(trigger) => {
                  if (typeof props.getPopupContainer === 'function')
                    return props.getPopupContainer(trigger)
                  let parentNode
                  switch (props.parentNodeLevel) {
                    case -1:
                      parentNode = document.body
                      break
                    case 0:
                      parentNode = trigger
                      break
                    case 1:
                      parentNode = trigger.parentNode as HTMLElement
                      break
                    case 2:
                      parentNode = trigger.parentNode?.parentNode as HTMLElement
                      break
                    case 3:
                      parentNode = trigger.parentNode?.parentNode?.parentNode as HTMLElement
                      break
                    default:
                      parentNode = trigger
                      break
                  }
                  return parentNode
                }}
                {...omit(props, [ 'getPopupContainer' ])}
              >
                <div>
                  {slots.default?.()}
                </div>
              </Tooltip>
            )
          }
        </>
      )
    }
  }
})
