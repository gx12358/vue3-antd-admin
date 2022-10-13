import type { CSSProperties } from 'vue'
import { computed, defineComponent, ref, watch, Teleport, nextTick } from 'vue'
import { useEventListener, useThrottleFn } from '@vueuse/core'
import { isServer, getPrefixCls, getSlotVNode } from '@gx-admin/utils'
import { onMountedOrActivated } from '@gx-admin/hooks/core'
import { getScrollContainer, isInContainer } from '@gx-design/utils'
import { isString } from '@/utils/validate'
import ImageViewer from './components/ImageViewer'
import { gImagePorps } from './props'

import './style.less'

const isHtmlElement = (e: any): e is Element => e && e.nodeType === Node.ELEMENT_NODE

const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined

let prevOverflow = ''

const ObjectFit = {
  NONE: 'none',
  CONTAIN: 'contain',
  COVER: 'cover',
  FILL: 'fill',
  SCALE_DOWN: 'scale-down'
}

const GImage = defineComponent({
  props: gImagePorps,
  name: 'GImage',
  inheritAttrs: false,
  emits: ['error', 'click'],
  setup(props, { slots, emit, attrs }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'image'
    })

    const hasLoadError = ref(false)
    const loading = ref(true)
    const imgWidth = ref(0)
    const imgHeight = ref(0)
    const showViewer = ref(false)
    const container = ref<any>(null)

    const _scrollContainer = ref<any>()
    let stopScrollListener: () => void
    let stopWheelListener: () => void

    const imageWidthHeightStyle = computed(() => {
      return {
        width: props.width ? `${props.width}px` : undefined,
        height: props.height ? `${props.height}px` : undefined
      }
    })

    const imageStyle = computed(() => {
      const { fit } = props
      if (!isServer && fit) {
        return isSupportObjectFit()
          ? { 'object-fit': fit, ...imageWidthHeightStyle.value }
          : { ...getImageStyle(fit), ...imageWidthHeightStyle.value }
      }
      return imageWidthHeightStyle.value
    })

    const alignCenter = computed(() => {
      const { fit } = props
      return !isServer && !isSupportObjectFit() && fit !== ObjectFit.FILL
    })

    const preview = computed(() => {
      const { previewSrcList } = props
      return Array.isArray(previewSrcList) && previewSrcList.length > 0
    })
    const imageIndex = computed(() => {
      const { src, previewSrcList } = props
      let previewIndex = 0
      const srcIndex = previewSrcList.indexOf(src)
      if (srcIndex >= 0) {
        previewIndex = srcIndex
      }
      return previewIndex
    })

    const getAttrs = computed(() => attrs)

    const getImageStyle = (fit) => {
      const imageWidth = props.width || imgWidth.value
      const imageHeight = props.height || imgHeight.value

      if (!container.value) return {}
      const { clientWidth: containerWidth, clientHeight: containerHeight } = container.value
      if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return {}

      const imageAspectRatio = imageWidth / imageHeight
      const containerAspectRatio = containerWidth / containerHeight

      if (fit === ObjectFit.SCALE_DOWN) {
        const isSmaller = imageWidth < containerWidth && imageHeight < containerHeight
        fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN
      }

      switch (fit) {
        case ObjectFit.NONE:
          return { width: 'auto', height: 'auto' }
        case ObjectFit.CONTAIN:
          return imageAspectRatio < containerAspectRatio ? { width: 'auto' } : { height: 'auto' }
        case ObjectFit.COVER:
          return imageAspectRatio < containerAspectRatio ? { height: 'auto' } : { width: 'auto' }
        default:
          return {}
      }
    }

    const loadImage = () => {
      if (isServer) return

      const attributes = getAttrs.value

      // reset status
      loading.value = true
      hasLoadError.value = false

      const img = new Image()
      img.onload = (e) => handleLoad(e, img)
      img.onerror = handleError

      // bind html attrs
      // so it can behave consistently
      Object.keys(attributes).forEach((key) => {
        // avoid onload to be overwritten
        if (key.toLowerCase() === 'onload') return
        const value = attributes[key] as string
        img.setAttribute(key, value)
      })
      img.src = props.src
    }

    function handleLazyLoad() {
      if (isInContainer(container.value, _scrollContainer.value)) {
        loadImage()
        removeLazyLoadListener()
      }
    }

    const lazyLoadHandler = useThrottleFn(handleLazyLoad, 200)

    const addLazyLoadListener = async () => {
      if (isServer) return

      await nextTick()

      const { scrollContainer } = props

      if (isHtmlElement(scrollContainer)) {
        _scrollContainer.value = scrollContainer
      } else if (isString(scrollContainer) && scrollContainer !== '') {
        _scrollContainer.value = document.querySelector<HTMLElement>(scrollContainer) ?? undefined
      } else if (container.value) {
        _scrollContainer.value = getScrollContainer(container.value)
      }

      if (_scrollContainer.value) {
        stopScrollListener = useEventListener(_scrollContainer, 'scroll', lazyLoadHandler)
        setTimeout(() => handleLazyLoad(), 200)
      }
    }

    const removeLazyLoadListener = () => {
      if (isServer || !_scrollContainer.value || !lazyLoadHandler) return

      stopScrollListener()
      _scrollContainer.value = undefined
    }

    const handleLoad = (_: Event, img: HTMLImageElement) => {
      imgWidth.value = img.width
      imgHeight.value = img.height
      loading.value = false
      hasLoadError.value = false
    }

    const handleError = (e: Event) => {
      loading.value = false
      hasLoadError.value = true
      emit('error', e)
    }

    const wheelHandler = (e: WheelEvent) => {
      if (!e.ctrlKey) return

      if (e.deltaY < 0) {
        e.preventDefault()
        return false
      } else if (e.deltaY > 0) {
        e.preventDefault()
        return false
      }
    }

    const clickHandler = () => {
      if (!preview.value || props.disablePreview) {
        return
      }

      stopWheelListener = useEventListener('wheel', wheelHandler, {
        passive: false
      })

      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      showViewer.value = true
    }

    const closeViewer = () => {
      stopWheelListener?.()
      document.body.style.overflow = prevOverflow
      showViewer.value = false
    }

    watch(
      () => props.src,
      () => {
        if (props.lazy) {
          // reset status
          loading.value = true
          hasLoadError.value = false
          removeLazyLoadListener()
          addLazyLoadListener()
        } else {
          loadImage()
        }
      }
    )

    onMountedOrActivated(() => {
      if (props.lazy) {
        addLazyLoadListener()
      } else {
        loadImage()
      }
    })

    return () => {
      const fallbackRender = getSlotVNode(slots, props, 'fallback')
      const placeholderRender = getSlotVNode(slots, props, 'placeholder')

      return (
        <>
          <div
            class={{
              [`${baseClassName}`]: true,
              [`${getAttrs.value.class}`]: getAttrs.value.class
            }}
            ref={(e) => (container.value = e)}
            style={{
              ...((getAttrs.value.style || {}) as CSSProperties),
              display: props.lazy ? 'block' : undefined
            }}
            onClick={() => {
              emit('click')
            }}
          >
            {loading.value ? (
              placeholderRender || <div class={`${baseClassName}-placeholder`} />
            ) : hasLoadError.value ? (
              fallbackRender || <div class={`${baseClassName}-error`}>加载失败</div>
            ) : (
              <img
                class={{
                  [`${baseClassName}-inner`]: true,
                  [`${baseClassName}-inner-center`]: alignCenter.value,
                  [`${baseClassName}-preview`]: preview.value
                }}
                {...getAttrs.value}
                src={props.src}
                style={imageStyle.value as CSSProperties}
                onClick={() => clickHandler()}
              />
            )}
            <Teleport to="body" disabled={!props.appendToBody}>
              {preview.value && showViewer.value && (
                <ImageViewer
                  zIndex={props.zIndex}
                  initialIndex={imageIndex.value}
                  urlList={props.previewSrcList}
                  onHideOnClickModal={props.hideOnClickModal}
                  onClose={() => closeViewer()}
                />
              )}
            </Teleport>
          </div>
        </>
      )
    }
  }
})

GImage.isWImage = true

export default GImage
