import { GImagePreview } from '@gx-design-vue/image'
import { GProModal } from '@gx-design-vue/pro-modal'
import { useProStyle } from '@gx-design-vue/pro-provider'
import { classNames, getFileSuffix, getPrefixCls } from '@gx-design-vue/pro-utils'
import APlayer from 'aplayer'
import Artplayer from 'artplayer'
import { cloneDeep } from 'lodash-es'
import {
  computed,
  defineComponent,
  onDeactivated,
  onUnmounted,
  reactive,
  ref,
  useId,
  watch
} from 'vue'
import { mediaViewProps } from './props'
import { genMediaViewtyle } from './style'
import 'aplayer/dist/APlayer.min.css'

const allowVideoType = [ 'mp4' ]

const defaultVideoOptions = {
  autoplay: true,
  loop: true,
  fullscreen: true,
  moreVideoAttr: {
    'webkit-playsinline': true,
    playsInline: true
  }
}

const GMediaView = defineComponent({
  name: 'GMediaView',
  props: mediaViewProps,
  emits: {
    change: (_open: boolean) => true,
    'update:open': (_open: boolean) => true
  },
  setup(props, { attrs, emit }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'media-view'
    })

    const { hashId, wrapSSR } = useProStyle('MediaView', [ genMediaViewtyle ], baseClassName)

    const uuid = useId()

    const imageViewerRef = ref()
    const musicPlayer = ref()
    const videoPlayer = ref()

    const open = ref(props.open)
    const spinning = ref(false)
    const spinningTip = ref('正在加载中...')
    const skeletonLoading = ref(false)

    const videoState = reactive({
      id: `video-player-${uuid}`,
      init: false,
      error: false
    })

    const audioState = reactive({
      id: `audio-player-${uuid}`,
    })

    const getViewUrl = computed(() => {
      return props.list?.map(item => item.url) || []
    })

    const getClassName = computed(() => {
      return {
        [`${baseClassName}`]: true,
        [`${attrs.class}`]: attrs.class
      }
    })

    const videoOptions = (url: string) => {
      const layers: any[] = [
        {
          name: 'close',
          html: `<i data-target="video" class="cursor-pointer text-hex-fff font-600 iconfont icon-guanbi1"></i>`,
          style: {
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 11
          },
          click: () => {
            closeViewer()
          }
        }
      ]
      if (!allowVideoType.includes(getFileSuffix(url))) {
        layers.push({
          name: 'notice-not-allow',
          html: `<span>不支持的视频格式</span>`,
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 10
          }
        })
      }

      return {
        layers
      }
    }

    const openViewer = () => {
      const row = props.list?.find(item => item.url)

      if (!row) return
      if (props.type === '2') {
        spinning.value = true
        setTimeout(() => {
          musicPlayer.value = new APlayer({
            container: document.getElementById(`${audioState.id}`),
            theme: 'var(--gx-color-primary)',
            autoplay: true,
            audio: cloneDeep(props.list)?.filter(item => item.url)?.map(item => ({ ...item, artist: '' })) || []
          })
          spinning.value = false
        }, 300)
      }
      if (props.type === '3') {
        spinning.value = true
        setTimeout(() => {
          videoPlayer.value = new Artplayer({
            ...defaultVideoOptions,
            container: `#${videoState.id}`,
            url: row.url,
            autoplay: allowVideoType.includes(getFileSuffix(row.url)),
            ...videoOptions(row.url)
          })

          videoPlayer.value.on('ready', () => {
            videoPlayer.value.autoSize()

            if (!videoState.init) {
              setTimeout(() => {
                videoState.init = true
                spinning.value = false
              }, 50)
            }
          })
          videoPlayer.value.on('video:error', () => {
            if (!videoState.init) {
              setTimeout(() => {
                videoState.init = true
                spinning.value = false
                videoState.error = true
                videoPlayer.value.layers.add({
                  name: 'notice-not-play',
                  html: `<span>视频加载失败</span>`,
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    zIndex: 10
                  }
                })
              }, 50)
            }
          })

          if (!allowVideoType.includes(getFileSuffix(row.url))) {
            videoState.init = true
            spinning.value = false
          }
        }, 300)
      }
    }

    function closeViewer() {
      spinning.value = false
      spinningTip.value = '正在加载中...'
      if (videoPlayer.value && typeof videoPlayer.value?.destroy === 'function') {
        videoPlayer.value?.destroy()
      }
      if (musicPlayer.value && typeof musicPlayer.value?.destroy === 'function') {
        musicPlayer.value?.destroy()
      }
      videoPlayer.value = null
      musicPlayer.value = null

      videoState.error = false
      videoState.init = false
      open.value = false
      emit('update:open', false)
      emit('change', open.value)
    }

    watch(() => props.open, (val) => {
      open.value = !!val
      if (val) {
        openViewer()
      }
    })

    watch(
      [ () => open.value, () => props.type, () => imageViewerRef.value ],
      ([ open, type, viewer ]) => {
        if (open && type === '1' && viewer) {
          viewer?.setOpen(true)
        }
      }
    )

    onUnmounted(() => {
      open.value = false
      emit('update:open', false)
      emit('change', false)
    })

    onDeactivated(() => {
      open.value = false
      emit('update:open', false)
      emit('change', false)
    })

    const videoRender = () => {
      return (
        <div class={classNames(`${baseClassName}-player-video`, hashId.value)}>
          <div
            style={{ width: '850px', height: '540px', ...props.playerStyle }}
            class={classNames(
              !videoState.init && `${baseClassName}-player-hidden`,
              videoState.error && `${baseClassName}-player-error`,
              props.playerClass,
              hashId.value
            )}
            id={videoState.id}
          />
        </div>
      )
    }

    const musicRender = () => {
      return (
        <div class={classNames(`${baseClassName}-player-music`, hashId.value)}>
          <div
            style={{ width: '450px', ...props.playerStyle }}
            class={props.playerClass}
            id={audioState.id}
          />
        </div>
      )
    }

    return () => {
      return wrapSSR(
        <>
          {props.type && getViewUrl.value && (
            <div class={getClassName.value}>
              {open.value && props.type === '1' && (
                <GImagePreview ref={imageViewerRef} urls={getViewUrl.value} onClose={() => closeViewer()} />
              )}
              <GProModal
                pure
                class={baseClassName}
                open={open.value && props.type !== '1'}
                type={props.type === '2' ? 'normal' : 'scroll'}
                skeletonLoading={skeletonLoading.value}
                spinning={spinning.value}
                spinningTip={spinningTip.value}
                onCancel={() => closeViewer()}
              >
                <div class={classNames(`${baseClassName}-player`, hashId.value)}>
                  {props.type === '2' && musicRender()}
                  {props.type === '3' && videoRender()}
                </div>
              </GProModal>
            </div>
          )}
        </>
      )
    }
  }
})

export default GMediaView
