import type { ExtractPropTypes } from 'vue'
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  onActivated,
  reactive,
  ref,
  watch,
  nextTick
} from 'vue'
import { VerticalAlignTopOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '@gx-admin/utils'
import { getScroll, scrollTo, throttleByAnimationFrame } from '@gx-design/utils'
import backTopProps from './props'

import './style.less'

export type BackTopProps = Partial<ExtractPropTypes<typeof backTopProps>>

const GBackTop = defineComponent({
  props: backTopProps,
  setup(props, { emit, slots }) {
    const prefixCls = getPrefixCls({
      suffixCls: 'back-top'
    })
    const innerWidth = ref(window.innerWidth)
    const state = reactive({
      visible: false,
      animated: false,
      animatedCssName: '',
      scrollEvent: null
    }) as {
      visible: boolean
      animated: boolean
      animatedCssName: string
      scrollEvent: { remove: () => void } | null
    }
    const bindScrollEvent = () => {
      const { root } = props
      const container = document.querySelector(root) as HTMLInputElement
      container.addEventListener('scroll', (e: Event) => {
        handleScroll(e)
      })
      handleScroll({
        target: container
      })
    }
    const scrollRemove = () => {
      const { root } = props
      const container = document.querySelector(root) as HTMLInputElement
      if (container) {
        container.removeEventListener('scroll', (e: Event) => {
          handleScroll(e)
        })
      }
      ;(handleScroll as any).cancel()
    }
    watch(
      () => props.root,
      () => {
        scrollRemove()
        nextTick(() => {
          bindScrollEvent()
        })
      }
    )
    onMounted(() => {
      nextTick(() => {
        bindScrollEvent()
        window.addEventListener('resize', getWidth)
      })
    })
    onActivated(() => {
      nextTick(() => {
        bindScrollEvent()
      })
    })
    onUnmounted(() => {
      scrollRemove()
      window.removeEventListener('resize', getWidth)
    })
    watch(innerWidth, (value) => {
      innerWidth.value = value
    })
    const targetStyle = computed(() => {
      const style = props.targetStyle
      if (innerWidth.value < 992)
        return {
          right: '50px',
          ...style
        }
      return style
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 监听屏幕宽度
     */
    const getWidth = () => {
      innerWidth.value = window.innerWidth
    }
    const handleScroll = throttleByAnimationFrame((e: Event | { target: any }) => {
      const { visibilityHeight } = props
      const scrollTop = getScroll(e.target, true)
      state.visible = scrollTop > visibilityHeight
    })
    const scrollToTop = (e) => {
      const { root, duration } = props
      scrollTo(0, {
        getContainer: () => document.querySelector(root) as HTMLInputElement,
        duration
      })
      emit('click', e)
    }
    const contentSlots = () => (
      <div class={`${prefixCls}-icon`}>
        <VerticalAlignTopOutlined />
      </div>
    )
    return () =>
      state.visible ? (
        <div
          class={[prefixCls, 'animated', state.animatedCssName]}
          onClick={scrollToTop}
          style={targetStyle.value}
        >
          <div class={`${prefixCls}-content`}>{slots.default?.() || contentSlots()}</div>
        </div>
      ) : null
  }
})

export default GBackTop
