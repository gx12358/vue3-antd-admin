import type { CSSProperties } from 'vue'
import { defineComponent, ref, computed, nextTick, watch } from 'vue'
import {
  OneToOneOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import { onMountedOrActivated } from '@gx-admin/hooks/core'
import { getPrefixCls, isServer } from '@gx-admin/utils'
import { on, off } from '@/utils'
import { gImageViewProps } from '../props'
import { EVENT_CODE } from '../utils/aria'

export type AnyFunction<T> = (...args: any[]) => T

export type ImageViewerAction = 'zoomIn' | 'zoomOut' | 'clocelise' | 'anticlocelise'

const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: <ExpandOutlined />
  },
  ORIGINAL: {
    name: 'original',
    icon: <OneToOneOutlined />
  }
}

export const isFirefox = function (): boolean {
  return !isServer && !!window.navigator.userAgent.match(/firefox/i)
}

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

export function rafThrottle<T extends AnyFunction<any>>(fn: T): AnyFunction<void> {
  let locked = false
  return function (...args: any[]) {
    if (locked) return
    locked = true
    window.requestAnimationFrame(() => {
      fn.apply(this, args)
      locked = false
    })
  }
}

const GImageViewer = defineComponent({
  props: gImageViewProps,
  emits: ['close', 'switch'],
  setup(props, { emit }) {
    let _keyDownHandler: any = null
    let _mouseWheelHandler: any = null
    let _dragHandler: any = null

    const baseClassName = getPrefixCls({
      suffixCls: 'image-viewer'
    })

    const loading = ref(true)
    const index = ref(props.initialIndex)
    const wrapper = ref<any>(null)
    const img = ref<any>(null)
    const mode = ref(Mode.CONTAIN)
    const transform = ref<any>({
      scale: 1,
      deg: 0,
      offsetX: 0,
      offsetY: 0,
      enableTransition: false
    })

    const isSingle = computed(() => {
      const { urlList } = props
      return urlList.length <= 1
    })

    const isFirst = computed(() => {
      return index.value === 0
    })

    const isLast = computed(() => {
      return index.value === props.urlList.length - 1
    })

    const currentImg = computed(() => {
      return props.urlList[index.value]
    })

    const animateCss = ref('viewer-fade-enter-active')

    const imgStyle = computed(() => {
      const { scale, deg, offsetX, offsetY, enableTransition } = transform.value
      const style: CSSProperties = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        marginLeft: `${offsetX}px`,
        marginTop: `${offsetY}px`
      }
      if (mode.value.name === Mode.CONTAIN.name) {
        style.maxWidth = style.maxHeight = '100%'
      }
      return style
    })

    const hide = () => {
      deviceSupportUninstall()
      setTimeout(() => {
        emit('close')
      }, 200)
    }

    const deviceSupportInstall = () => {
      animateCss.value = 'viewer-fade-enter-active'
      _keyDownHandler = rafThrottle((e: KeyboardEvent) => {
        switch (e.code) {
          // ESC
          case EVENT_CODE.esc:
            hide()
            break
          // SPACE
          case EVENT_CODE.space:
            toggleMode()
            break
          // LEFT_ARROW
          case EVENT_CODE.left:
            prev()
            break
          // UP_ARROW
          case EVENT_CODE.up:
            handleActions('zoomIn')
            break
          // RIGHT_ARROW
          case EVENT_CODE.right:
            next()
            break
          // DOWN_ARROW
          case EVENT_CODE.down:
            handleActions('zoomOut')
            break
        }
      })

      _mouseWheelHandler = rafThrottle((e) => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail
        if (delta > 0) {
          handleActions('zoomIn', {
            zoomRate: 0.015,
            enableTransition: false
          })
        } else {
          handleActions('zoomOut', {
            zoomRate: 0.015,
            enableTransition: false
          })
        }
      })
      on(document, 'keydown', _keyDownHandler)
      on(document, mousewheelEventName, _mouseWheelHandler)
    }

    const deviceSupportUninstall = () => {
      animateCss.value = 'viewer-fade-leave-active'
      off(document, 'keydown', _keyDownHandler)
      off(document, mousewheelEventName, _mouseWheelHandler)
      _keyDownHandler = null
      _mouseWheelHandler = null
    }

    const handleImgLoad = () => {
      loading.value = false
    }

    const handleImgError = (e) => {
      loading.value = false
      e.target.alt = '加载失败'
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (loading.value || e.button !== 0) return

      const { offsetX, offsetY } = transform.value
      const startX = e.pageX
      const startY = e.pageY
      _dragHandler = rafThrottle((ev) => {
        transform.value = {
          ...transform.value,
          offsetX: offsetX + ev.pageX - startX,
          offsetY: offsetY + ev.pageY - startY
        }
      })
      on(document, 'mousemove', _dragHandler)
      on(document, 'mouseup', () => {
        off(document, 'mousemove', _dragHandler)
      })

      e.preventDefault()
    }

    const reset = () => {
      transform.value = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    }

    const toggleMode = () => {
      if (loading.value) return

      const modeNames = Object.keys(Mode)
      const modeValues = Object.values(Mode)
      const currentMode = mode.value.name
      const index = modeValues.findIndex((i) => i.name === currentMode)
      const nextIndex = (index + 1) % modeNames.length
      mode.value = Mode[modeNames[nextIndex]]
      reset()
    }

    const prev = () => {
      if (isFirst.value && !props.infinite) return
      const len = props.urlList.length
      index.value = (index.value - 1 + len) % len
    }

    const next = () => {
      if (isLast.value && !props.infinite) return
      const len = props.urlList.length
      index.value = (index.value + 1) % len
    }

    const handleActions = (action: ImageViewerAction, options = {}) => {
      if (loading.value) return
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      }
      switch (action) {
        case 'zoomOut':
          if (transform.value.scale > 0.2) {
            transform.value.scale = parseFloat((transform.value.scale - zoomRate).toFixed(3))
          }
          break
        case 'zoomIn':
          transform.value.scale = parseFloat((transform.value.scale + zoomRate).toFixed(3))
          break
        case 'clocelise':
          transform.value.deg += rotateDeg
          break
        case 'anticlocelise':
          transform.value.deg -= rotateDeg
          break
      }
      transform.value.enableTransition = enableTransition
    }

    watch(currentImg, () => {
      nextTick(() => {
        const $img: any = img.value
        if (!$img.complete) {
          loading.value = true
        }
      })
    })

    watch(index, (val) => {
      reset()
      emit('switch', val)
    })

    onMountedOrActivated(() => {
      deviceSupportInstall()
      wrapper.value?.focus?.()
    })

    return () => {
      return (
        <div
          ref={(e) => (wrapper.value = e)}
          tabindex={1}
          class={[`${baseClassName}-wrapper`, `${animateCss.value}`]}
          style={{ zIndex: props.zIndex }}
        >
          <div class={`${baseClassName}-mask`} onClick={() => props.onHideOnClickModal && hide()} />
          <span class={[`${baseClassName}-btn`, `${baseClassName}-close`]} onClick={() => hide()}>
            <CloseOutlined />
          </span>
          {!isSingle.value && (
            <>
              <span
                class={{
                  [`${baseClassName}-btn`]: true,
                  [`${baseClassName}-prev`]: true,
                  [`is-disabled`]: !props.infinite && isFirst.value
                }}
                onClick={() => prev()}
              >
                <LeftOutlined />
              </span>
              <span
                class={{
                  [`${baseClassName}-btn`]: true,
                  [`${baseClassName}-next`]: true,
                  [`is-disabled`]: !props.infinite && isFirst.value
                }}
                onClick={() => next()}
              >
                <RightOutlined />
              </span>
            </>
          )}
          <div class={[`${baseClassName}-btn`, `${baseClassName}-actions`]}>
            <div class={`${baseClassName}-actions-inner`}>
              <ZoomOutOutlined onClick={() => handleActions('zoomOut')} />
              <ZoomInOutlined onClick={() => handleActions('zoomIn')} />
              <i class={`${baseClassName}-actions-divider`}></i>
              <i onClick={() => toggleMode()}>{mode.value.icon}</i>
              <i class={`${baseClassName}-actions-divider`}></i>
              <RotateLeftOutlined onClick={() => handleActions('anticlocelise')} />
              <RotateRightOutlined onClick={() => handleActions('clocelise')} />
            </div>
          </div>
          {loading.value && (
            <div class={`${baseClassName}-canvas`}>
              <a-spin indicator={<LoadingOutlined style={{ color: '#fff', fontSize: '40px' }} />} />
            </div>
          )}
          <div class={`${baseClassName}-canvas`}>
            {props.urlList.map((url, i) => {
              return (
                <img
                  ref={(e) => (img.value = e)}
                  class={`${baseClassName}-img`}
                  key={url}
                  style={{ ...imgStyle.value, display: i === index.value ? 'block' : 'none' }}
                  src={url}
                  onLoad={() => handleImgLoad()}
                  onError={(e) => handleImgError(e)}
                  onMousedown={(e) => handleMouseDown(e)}
                />
              )
            })}
          </div>
        </div>
      )
    }
  }
})

export default GImageViewer
