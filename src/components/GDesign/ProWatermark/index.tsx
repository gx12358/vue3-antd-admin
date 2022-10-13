import { computed, ref, defineComponent, ExtractPropTypes, watchEffect } from 'vue'
import config from '/config/config'
import { getPrefixCls } from '@gx-admin/utils'
import { waterMarkProps } from './props'

import './style.less'

const { waterMarkTitle } = config.defaultSettings

export type WaterMarkProps = Partial<ExtractPropTypes<typeof waterMarkProps>>

/**
 * 返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
 *
 * @param context
 * @see api 有些废弃了，其实类型 CanvasRenderingContext2D
 */
const getPixelRatio = (context: any) => {
  if (!context) {
    return 1
  }
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1
  return (window.devicePixelRatio || 1) / backingStore
}

const GPorWaterMark = defineComponent({
  props: waterMarkProps,
  setup(props, { slots }) {
    const prefixCls = getPrefixCls({
      suffixCls: 'watermark',
      isPor: true
    })

    const base64Url = ref('')

    const wrapperCls = computed(() => `${prefixCls}-wrapper`)
    const waterMakrCls = computed(() => {
      return {
        [`${prefixCls}`]: prefixCls,
        [`${props.markClassName}`]: props.markClassName
      }
    })

    watchEffect(() => {
      const {
        gapX = 212,
        gapY = 222,
        width = 120,
        height = 64,
        rotate = -22,
        image,
        content = waterMarkTitle || 'GX Pro Admin',
        offsetLeft,
        offsetTop,
        fontStyle = 'normal',
        fontWeight = 'normal',
        fontColor = 'rgba(0,0,0,.15)',
        fontSize = 16,
        fontFamily = 'sans-serif'
      } = props
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const ratio = getPixelRatio(ctx)

      const canvasWidth = `${(gapX + width) * ratio}px`
      const canvasHeight = `${(gapY + height) * ratio}px`
      const canvasOffsetLeft = offsetLeft || gapX / 2
      const canvasOffsetTop = offsetTop || gapY / 2

      canvas.setAttribute('width', canvasWidth)
      canvas.setAttribute('height', canvasHeight)

      if (ctx) {
        // 旋转字符 rotate
        ctx.translate(canvasOffsetLeft * ratio, canvasOffsetTop * ratio)
        ctx.rotate((Math.PI / 180) * Number(rotate))
        const markWidth = width * ratio
        const markHeight = height * ratio

        if (image) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.referrerPolicy = 'no-referrer'
          img.src = image
          img.onload = () => {
            ctx.drawImage(img, 0, 0, markWidth, markHeight)
            base64Url.value = canvas.toDataURL()
          }
        } else if (content) {
          const markSize = Number(fontSize) * ratio
          ctx.font = `${fontStyle} normal ${fontWeight} ${markSize}px/${markHeight}px ${fontFamily}`
          ctx.fillStyle = fontColor
          ctx.fillText(content, 0, 0)
          base64Url.value = canvas.toDataURL()
        }
      } else {
        console.error('当前环境不支持Canvas')
      }
    })

    return () => (
      <div
        style={{
          position: 'relative'
        }}
        class={wrapperCls.value}
      >
        {slots.default?.()}
        <div
          class={waterMakrCls.value}
          style={{
            zIndex: Number(props.zIndex),
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundSize: `${Number(props.gapX || 212) + Number(props.width || 120)}px`,
            pointerEvents: 'none',
            backgroundRepeat: 'repeat',
            backgroundImage: `url('${base64Url.value}')`,
            ...props.markStyle
          }}
        />
      </div>
    )
  }
})

export default GPorWaterMark
