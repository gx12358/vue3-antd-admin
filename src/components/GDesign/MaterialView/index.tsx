import type { ExtractPropTypes } from 'vue'
import Nodata from '@/assets/public_images/nodata.svg'
import PlayerAudio from '@gx-design/PlayerAudio'
import GPlayerVideo from '@gx-design/PlayerVideo'
import { ImageViewer } from '@gx-design-vue/image'
import { GProModal } from '@gx-design-vue/pro-modal'
import {
  getFileSuffix,
  getPrefixCls,
  globalConfig,
  isArray,
  isString
} from '@gx-design-vue/pro-utils'
import { Empty } from 'ant-design-vue'
import ResizeObserver from 'ant-design-vue/es/vc-resize-observer'
import { computed, defineComponent, onDeactivated, onUnmounted, ref, watch } from 'vue'
import { gMaterialViewProps } from './props'

import './style.less'

export type GMaterialViewProps = Partial<ExtractPropTypes<typeof gMaterialViewProps>>

export default defineComponent({
  name: 'GMaterialView',
  props: gMaterialViewProps,
  emits: [ 'update:visible', 'change' ],
  setup(props, { attrs, emit }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'material-view'
    })

    const imageViewerRef = ref()
    const musicPlayer = ref()
    const videoPlayer = ref()
    const responsive = ref(false)
    const showViewer = ref(false)
    const spinning = ref(false)
    const spinningTip = ref('正在加载中...')
    const skeletonLoading = ref(false)

    const getModalTitle = computed(() => (props.type === '2' ? '音频播放' : '视频播放'))

    const getViewUrl = computed(() => {
      if (props.type === '1' && isString(props.url)) {
        return [ props.url ]
      }
      if ((props.type === '2' || props.type === '3') && isArray(props.url)) {
        return props.url[0]
      }
      return props.url
    })

    const allowPlay = computed(() => {
      if (props.type === '1') {
        return true
      }
      const fileSuffix = getFileSuffix(getViewUrl.value as string)
      if (props.type === '2') {
        return globalConfig.audioAllowType.includes(fileSuffix.toLowerCase())
      }
      return globalConfig.videoAllowType.includes(fileSuffix.toLowerCase())
    })

    const getClassName = computed(() => {
      return {
        [`${baseClassName}`]: true,
        [`${attrs.class}`]: attrs.class
      }
    })

    const setResponsive = (value: boolean) => {
      responsive.value = value
    }

    const openViewer = () => {
      if (props.type !== '1') {
        spinning.value = true
        setTimeout(() => {
          spinning.value = false
        }, 1000)
      }
    }

    const closeViewer = () => {
      spinning.value = false
      spinningTip.value = '正在加载中...'
      if (allowPlay.value) {
        videoPlayer.value && typeof videoPlayer.value?.destroy === 'function' && videoPlayer.value?.destroy()
      }
      videoPlayer.value = null
      musicPlayer.value = null
      showViewer.value = false
      emit('update:visible', false)
      emit('change', showViewer.value)
    }

    watch(
      () => props.visible,
      (visible) => {
        showViewer.value = visible
        if (visible) {
          openViewer()
        }
      }
    )

    watch(
      [ () => showViewer.value, () => props.type, () => imageViewerRef.value ],
      ([ open, type, viewer ]) => {
        if (open && type === '1' && viewer) {
          viewer?.setOpen(true)
        }
      }
    )

    onUnmounted(() => {
      showViewer.value = false
      emit('update:visible', false)
      emit('change', false)
    })

    onDeactivated(() => {
      showViewer.value = false
      emit('update:visible', false)
      emit('change', false)
    })

    const renderModalContent = () => (
      <>
        {allowPlay.value ? (
          <div
            style={
              props.type === '2'
                ? { height: '66px', width: '500px' }
                : props.type === '3'
                  ? { height: responsive.value ? '400px' : '590px', width: '850px' }
                  : undefined
            }
            class={`${baseClassName}-player`}
          >
            {!spinning.value && !!getViewUrl.value && props.type === '2' && (
              <PlayerAudio src={getViewUrl.value as string} />
            )}
            {!spinning.value && !!getViewUrl.value && props.type === '3' && (
              <GPlayerVideo src={getViewUrl.value as string} />
            )}
          </div>
        ) : (
          <Empty image={Nodata} description="该格式不支持在线播放" />
        )}
      </>
    )

    return () => {
      return (
        <ResizeObserver
          key="resize-observer"
          onResize={({ width }) => {
            setResponsive(width < 1540)
          }}
        >
          {props.type && getViewUrl.value && (
            <div class={getClassName.value}>
              {showViewer.value && props.type === '1' && (
                <ImageViewer ref={imageViewerRef} urlList={getViewUrl.value as string[]} onClose={() => closeViewer()} />
              )}
              <GProModal
                noStyle
                class={baseClassName}
                title={getModalTitle.value}
                open={showViewer.value && props.type !== '1'}
                showDefaultFooter
                type={props.type === '2' ? 'normal' : 'scroll'}
                skeletonLoading={skeletonLoading.value}
                spinning={spinning.value}
                spinningTip={spinningTip.value}
                onCancel={() => closeViewer()}
              >
                {renderModalContent()}
              </GProModal>
            </div>
          )}
        </ResizeObserver>
      )
    }
  }
})
