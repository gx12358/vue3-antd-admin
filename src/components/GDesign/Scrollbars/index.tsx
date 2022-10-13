import { ExtractPropTypes, StyleValue } from 'vue'
import { defineComponent, watch, provide, onMounted, ref, computed } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { getPrefixCls } from '@gx-admin/utils'
import { isNumber, isObject } from '@/utils/validate'
import { scrollbarEmits, scrollbarProps } from './props'
import { scrollbarContextKey } from './context'
import Bar from './components/Bar'
import { addUnit } from './util'

import './style.less'

export type ScrollbarProps = ExtractPropTypes<typeof scrollbarProps>

const GBars = defineComponent({
  name: 'GBars',
  props: scrollbarProps,
  emits: scrollbarEmits,
  setup(props, { emit }) {
    const prefixCls = getPrefixCls({
      suffixCls: 'scrollbar'
    })

    let stopResizeObserver: (() => void) | undefined = undefined
    let stopResizeListener: (() => void) | undefined = undefined

    const scrollbar$ = ref()
    const wrap$ = ref()
    const resize$ = ref()

    const sizeWidth = ref('0')
    const sizeHeight = ref('0')
    const barRef = ref()
    const moveX = ref(0)
    const moveY = ref(0)
    const ratioY = ref(1)
    const ratioX = ref(1)
    const SCOPE = 'GBars'
    const GAP = 4 // top 2 + bottom 2 of bar instance

    const style = computed<StyleValue>(() => {
      const style: any = {}
      if (props.height) style.height = addUnit(props.height)
      if (props.maxHeight) style.maxHeight = addUnit(props.maxHeight)
      return [props.wrapStyle, style]
    })

    const handleScroll = () => {
      if (wrap$.value) {
        barRef.value?.handleScroll(wrap$.value)

        emit('scroll', {
          scrollTop: wrap$.value.scrollTop,
          scrollLeft: wrap$.value.scrollLeft
        })
      }
    }

    function scrollTo(xCord: number, yCord?: number): void
    function scrollTo(options: ScrollToOptions): void
    function scrollTo(arg1: unknown, arg2?: number) {
      if (isObject(arg1)) {
        wrap$.value!.scrollTo(arg1)
      } else if (isNumber(arg1) && isNumber(arg2)) {
        wrap$.value!.scrollTo(arg1, arg2)
      }
    }

    const setScrollTop = (value: number) => {
      if (!isNumber(value)) {
        console.warn(SCOPE, 'value 必须为数字')
        return
      }
      wrap$.value!.scrollTop = value
    }

    const setScrollLeft = (value: number) => {
      if (!isNumber(value)) {
        console.warn(SCOPE, 'value 必须为数字')
        return
      }
      wrap$.value!.scrollLeft = value
    }

    const update = () => {
      if (!wrap$.value) return
      const offsetHeight = wrap$.value.offsetHeight - GAP
      const offsetWidth = wrap$.value.offsetWidth - GAP

      const originalHeight = offsetHeight ** 2 / wrap$.value.scrollHeight
      const originalWidth = offsetWidth ** 2 / wrap$.value.scrollWidth
      const height = Math.max(originalHeight, props.minSize)
      const width = Math.max(originalWidth, props.minSize)

      ratioY.value =
        originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height))
      ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width))

      sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : ''
      sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : ''
    }

    watch(
      () => props.noresize,
      (noresize) => {
        if (noresize) {
          stopResizeObserver?.()
          stopResizeListener?.()
        } else {
          ;({ stop: stopResizeObserver } = useResizeObserver(resize$, update))
          stopResizeListener = useEventListener('resize', update)
        }
      },
      { immediate: true }
    )

    watch(
      () => [props.maxHeight, props.height],
      () => {
        if (!props.native)
          nextTick(() => {
            update()
            if (wrap$.value) {
              barRef.value?.handleScroll(wrap$.value)
            }
          })
      }
    )

    provide(
      scrollbarContextKey,
      reactive({
        scrollbarElement: scrollbar$,
        wrapElement: wrap$
      })
    )

    onMounted(() => {
      if (!props.native) nextTick(() => update())
    })

    return {
      barRef,
      wrap$,
      scrollbar$,
      resize$,
      style,
      moveX,
      moveY,
      prefixCls,
      sizeHeight,
      sizeWidth,
      ratioX,
      ratioY,
      handleScroll,
      scrollTo,
      setScrollTop,
      setScrollLeft
    }
  },
  render() {
    const CustomTag: any = this.tag
    return (
      <div ref={(e) => (this.scrollbar$ = e)} class={this.prefixCls}>
        <div
          ref={(e) => (this.wrap$ = e)}
          class={[
            this.wrapClass,
            `${this.prefixCls}-wrap`,
            this.native ? '' : `${this.prefixCls}-wrap-hidden-default`
          ]}
          style={this.style}
          onScroll={this.handleScroll}
        >
          <CustomTag
            ref={(e) => (this.resize$ = e)}
            class={[`${this.prefixCls}-view`, this.viewClass]}
            style={this.viewStyle}
          >
            {this.$slots.default?.()}
          </CustomTag>
        </div>
        {!this.native && (
          <Bar
            ref={(e) => (this.barRef = e)}
            className={this.prefixCls}
            height={this.sizeHeight}
            width={this.sizeWidth}
            always={this.always}
            ratioX={this.ratioX}
            ratioY={this.ratioY}
          />
        )}
      </div>
    )
  }
})

GBars.inheritAttrs = false

export default GBars
