import { defineComponent, computed, ref, onMounted, toRef } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { getPrefixCls, isArray, getRandomNumber } from '@gx-design-vue/pro-utils'
import { videoProps } from './props'
import useVideo from './hooks/useVideo'
import { provideVideoContext } from './context'
import videoEvent from './utils/event'
import type { VideoSource } from './typings'
import Error from './components/Error'
import Loading from './components/Loading'
import Controls from './components/Controls'

import './style.less'

const GPlayerVideo = defineComponent({
  name: 'GPlayerVideo',
  props: videoProps,
  setup(props, { expose }) {
    const className = getPrefixCls({
      suffixCls: 'video'
    })

    const player = ref<HTMLVideoElement>()
    const playerRef = ref<HTMLElement>()

    const { onEvent } = useVideo(player)

    const uid = ref<string>(getRandomNumber().uuid(15))

    const isError = ref<boolean>(false)
    const loading = ref<boolean>(false)
    const isPlaying = ref<boolean>(false)

    const loadingLayer = ref()
    const controlsLayer = ref()

    const { toggle, isFullscreen } = useFullscreen(playerRef)

    const videoSource = computed(() => {
      if (isArray(props.src)) return (props.src as VideoSource[])?.[0].src || ''
      return props.src as string
    })

    onMounted(() => {
      initPlayer()
    })

    const initPlayer = () => {
      if (videoSource.value) {
        onEvent(player.value, [videoEvent.PLAY], () => {
          isPlaying.value = true
        })
        onEvent(player.value, [videoEvent.PAUSE], () => {
          isPlaying.value = false
        })
        onEvent(player.value, [videoEvent.ERROR], () => {
          isError.value = true
          removeAllEvents()
        })
      } else {
        isError.value = true
      }
    }

    const refreshVideo = () => {
      removeAllEvents()
      isError.value = false
      loading.value = true
      setTimeout(() => {
        loading.value = false
        uid.value = getRandomNumber().uuid(15)
        initPlayer()
      }, 200)
    }

    const play = () => {
      if (!loading.value) player.value.play()
    }

    const pause = () => {
      if (!loading.value) player.value.pause()
    }

    const changeLoading = (val: boolean) => (loading.value = val)

    provideVideoContext({
      loop: toRef(props, 'loop'),
      muted: toRef(props, 'muted'),
      autoplay: toRef(props, 'autoplay'),
      player,
      loading,
      isPlaying,
      fullScreen: isFullscreen,
      play,
      pause,
      toggleScreen: toggle,
      changeLoading
    })

    const removeAllEvents = () => {
      loadingLayer.value?.remove()
    }

    expose({
      destroy: () => removeAllEvents()
    })

    return () => {
      return (
        <>
          <div key={uid.value} ref={playerRef} class={`${className}-container`}>
            <video
              ref={player}
              src={videoSource.value}
              loop={props.loop}
              autoplay={props.autoplay}
              controls={false}
            />
            <div class={`${className}-mask`}>
              <div
                onClick={() => (isPlaying.value ? pause() : play())}
                class={`${className}-play-pause`}
              />
              <Error open={isError.value} prefixCls={className} refresh={() => refreshVideo()} />
              <Loading ref={(e) => (loadingLayer.value = e)} prefixCls={`${className}`} />
            </div>
            <Controls ref={controlsLayer} open={!isError.value} prefixCls={className} />
          </div>
        </>
      )
    }
  }
})

export default GPlayerVideo
