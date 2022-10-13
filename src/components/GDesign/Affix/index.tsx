import type { CSSProperties, ExtractPropTypes } from 'vue'
import { computed, defineComponent, reactive, watch, shallowRef, ref, onDeactivated } from 'vue'
import { cloneDeep } from 'lodash-es'
import config from '/config/config'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { getPrefixCls } from '@gx-admin/utils'
import { getScrollContainer } from '@gx-design/utils'
import { onMountedOrActivated } from '@gx-admin/hooks/core'
import { PropTypes } from '@/utils'

import './style.less'

const { defaultSettings } = config

const defaultState = {
  fixed: false,
  height: 0, // height of root
  width: 0, // width of root
  scrollTop: 0, // scrollTop of documentElement
  clientHeight: 0, // clientHeight of documentElement
  transform: 0
}

const affixProps = {
  zIndex: PropTypes.number.def(100),
  offset: PropTypes.number.def(0),
  target: PropTypes.string.def(defaultSettings.viewScrollRoot),
  position: {
    type: String,
    values: ['top', 'bottom'],
    default: 'top'
  }
}

export type AffixProps = Partial<ExtractPropTypes<typeof affixProps>>

const GAffix = defineComponent({
  name: 'GAffix',
  props: affixProps,
  emits: ['change', 'scroll'],
  setup(props, { slots, emit }) {
    const className = getPrefixCls({
      suffixCls: 'affix'
    })
    const affixShow = ref(false)
    const target = shallowRef<HTMLElement>()
    const root = shallowRef<any>()
    const scrollContainer = shallowRef<HTMLElement | Window>()

    const state = reactive(cloneDeep(defaultState))

    const rootStyle = computed<CSSProperties>(() => {
      return {
        height: state.fixed ? `${state.height}px` : '',
        width: state.fixed ? `${state.width}px` : ''
      }
    })

    const affixStyle = computed<CSSProperties | undefined>(() => {
      if (!state.fixed) return

      const offset = props.offset ? `${props.offset}px` : 0
      const transform = state.transform ? `translateY(${state.transform}px)` : ''

      return {
        height: `${state.height}px`,
        width: `${state.width}px`,
        top: props.position === 'top' ? offset : '',
        bottom: props.position === 'bottom' ? offset : '',
        transform,
        zIndex: props.zIndex,
        maxHeight: `calc(90vh - ${((offset || 114) as number) + 32}px)`
      }
    })

    const update = () => {
      if (!root.value || !target.value || !scrollContainer.value) {
        return
      }

      const rootRect = root.value.getBoundingClientRect()
      const targetRect = target.value.getBoundingClientRect()
      state.height = rootRect.height
      state.width = rootRect.width
      state.scrollTop =
        scrollContainer.value instanceof Window
          ? document.documentElement.scrollTop
          : scrollContainer.value.scrollTop
      state.clientHeight = document.documentElement.clientHeight

      if (props.position === 'top') {
        if (props.target) {
          const difference = targetRect.bottom - props.offset - state.height
          state.fixed = props.offset > rootRect.top && targetRect.bottom > 0
          state.transform = difference < 0 ? difference : 0
        } else {
          state.fixed = props.offset > rootRect.top
        }
      } else {
        if (props.target) {
          const difference = state.clientHeight - targetRect.top - props.offset - state.height
          state.fixed =
            state.clientHeight - props.offset < rootRect.bottom &&
            state.clientHeight > targetRect.top
          state.transform = difference < 0 ? -difference : 0
        } else {
          state.fixed = state.clientHeight - props.offset < rootRect.bottom
        }
      }
    }

    const onScroll = () => {
      update()

      emit('scroll', {
        scrollTop: state.scrollTop,
        fixed: state.fixed
      })
    }

    watch(
      () => state.fixed,
      () => {
        emit('change', state.fixed)
      }
    )

    const init = () => {
      if (props.target) {
        target.value = document.querySelector<HTMLElement>(props.target) ?? undefined
        if (!target.value) {
          throw new Error(`Target is not existed: ${props.target}`)
        }
      } else {
        target.value = document.documentElement
      }
      scrollContainer.value = getScrollContainer(root.value!, true)
    }

    onMountedOrActivated(() => {
      affixShow.value = true
      setTimeout(() => {
        init()
        useEventListener(scrollContainer, 'scroll', onScroll)
        useResizeObserver(root, () => setTimeout(() => update()))
        useResizeObserver(target, () => setTimeout(() => update()))
      }, 100)
    })

    onDeactivated(() => {
      affixShow.value = false
      Object.assign(state, cloneDeep(defaultState))
    })

    return () => {
      return (
        affixShow.value && (
          <div ref={(e) => (root.value = e)} class={className} style={rootStyle.value}>
            <div
              class={{ [`${className}-fixed`]: state.fixed }}
              style={{
                ...affixStyle.value,
                maxHeight: `calc(90vh - ${((affixStyle.value?.top || 114) as number) + 32}px)`
              }}
            >
              <g-bars style={{ height: '100%' }}>{slots.default?.()}</g-bars>
            </div>
          </div>
        )
      )
    }
  }
})

export default GAffix
