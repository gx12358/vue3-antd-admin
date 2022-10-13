import { computed, defineComponent, ExtractPropTypes } from 'vue'
import { getPrefixCls } from '@gx-admin/utils'
import gskeletonProps from './props'
import './style.less'

const button = ['circle', 'round', 'default']
const avatar = ['circle', 'square']

export type GSkeletonProps = Partial<ExtractPropTypes<typeof gskeletonProps>>

export default defineComponent({
  props: gskeletonProps,
  setup(props, { slots }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'skeleton'
    })
    const handelType = computed(() => {
      let show
      switch (props.type) {
        case 'button':
          show = renderTypeDefault()
          break
        case 'avatar':
          show = renderTypeDefault()
          break
        case 'input':
          show = renderTypeInput()
          break
        case 'image':
          show = renderTypeImage()
          break
      }
      return show
    })
    const handelSizeClass = computed(() => {
      if (props.size === 'default' || typeof props.size === 'number') return ''
      return `${baseClassName}-${props.type}-${props.size}`
    })
    const handelSize = computed(() => {
      let style = {}
      if (typeof props.size === 'number') {
        switch (props.type) {
          case 'button':
            break
          case 'avatar':
            style = {
              width: `${props.size}px`,
              height: `${props.size}px`,
              lineHeight: `${props.size}px`
            }
            break
          case 'input':
            break
          case 'image':
            break
        }
      }
      return style
    })
    const handelShape = computed(() => {
      let shape
      switch (props.type) {
        case 'button':
          shape = button.find((item) => item === props.shape) || 'default'
          break
        case 'avatar':
          shape = avatar.find((item) => item === props.shape) || 'circle'
          break
      }
      return `${baseClassName}-${props.type}-${shape}`
    })
    const renderTypeDefault = () => (
      <span
        style={{ ...props.propsStyle, ...handelSize.value }}
        class={{
          [`${baseClassName}-${props.type}`]: true,
          [`${handelSizeClass.value}`]: true,
          [`${handelShape.value}`]: props.shape
        }}
      />
    )
    const renderTypeInput = () => (
      <span
        style={{ width: '200px', ...props.propsStyle }}
        class={[`${baseClassName}-${props.type}`, handelSizeClass.value]}
      />
    )
    const renderTypeImage = () => (
      <div class={`${baseClassName}-${props.type}`}>
        <svg
          viewBox="0 0 1098 1024"
          xmlns="http://www.w3.org/2000/svg"
          class={`${baseClassName}-image-svg`}
        >
          <path
            d="M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z"
            class={`${baseClassName}-image-path`}
          ></path>
        </svg>
      </div>
    )
    const renderSkeleton = () => (
      <div
        class={{
          [`${baseClassName}`]: true,
          [`${baseClassName}-element`]: true,
          [`${baseClassName}-active`]: props.active
        }}
      >
        {handelType.value}
      </div>
    )
    return () => <>{props.loading ? renderSkeleton() : slots.default?.() || renderSkeleton()}</>
  }
})
