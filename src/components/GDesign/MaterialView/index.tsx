import type { ExtractPropTypes } from 'vue'
import { computed, defineComponent, ref, Teleport, watch, onDeactivated, onUnmounted } from 'vue'
import { Empty } from 'ant-design-vue'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'
import Nodata from '@/assets/public_images/nodata.png'
import global from '@/common/global'
import GPlayerVideo from '@gx-design/PlayerVideo'
import PlayerAudio from '@gx-design/PlayerAudio'
import { getPrefixCls } from '@gx-admin/utils'
import { getFileSuffix } from '@/utils/util'
import { isString, isArray } from '@/utils/validate'
import { gMaterialViewProps } from './props'

import './style.less'

export type GMaterialViewProps = Partial<ExtractPropTypes<typeof gMaterialViewProps>>

export default defineComponent({
  props: gMaterialViewProps,
  emits: ['update:visible', 'change'],
  setup(props, { attrs, emit }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'material-view'
    })

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
        return [props.url]
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
        return global.audioAllowType.includes(fileSuffix.toLowerCase())
      }
      return global.videoAllowType.includes(fileSuffix.toLowerCase())
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
        videoPlayer.value &&
          typeof videoPlayer.value?.destroy === 'function' &&
          videoPlayer.value?.destroy()
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
                ? { height: '66px' }
                : props.type === '3'
                ? { height: responsive.value ? '400px' : '590px' }
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
      const { type } = props
      return (
        <ResizeObserver
          key="resize-observer"
          onResize={({ width }) => {
            setResponsive(width < 1540)
          }}
        >
          {type && getViewUrl.value && (
            <div class={getClassName.value}>
              <Teleport to="body">
                {showViewer.value && type === '1' && (
                  <g-image-viewer urlList={getViewUrl.value} onClose={() => closeViewer()} />
                )}
              </Teleport>
              <g-pro-modal
                class={baseClassName}
                title={getModalTitle.value}
                visible={showViewer.value && type !== '1'}
                width={type === '3' ? 850 : 500}
                showDefaultFooter
                type={type === '2' ? 'normal' : 'fixed'}
                skeletonLoading={skeletonLoading.value}
                spinning={spinning.value}
                spinningTip={spinningTip.value}
                onCancel={() => closeViewer()}
              >
                {renderModalContent()}
              </g-pro-modal>
            </div>
          )}
        </ResizeObserver>
      )
    }
  }
})
