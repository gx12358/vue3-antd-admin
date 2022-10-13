import { ComputedRef, onMounted } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import { audioProps } from './props'
import { getPrefixCls } from '@gx-admin/utils'
import { isArray } from '@/utils/validate'
import useAudio from './hooks/useAudio'
import audioEvent from './utils/event'
import type { AudioSource } from './typings'
import { provideAudioContext } from './context'
import Time from './components/Time'
import Progress from './components/Progress'

import './style.less'

const GPlayerAudio = defineComponent({
  name: 'GPlayerAudio',
  props: audioProps,
  setup(props) {
    const prefixCls = getPrefixCls({
      suffixCls: 'audio'
    })

    const player = ref<HTMLAudioElement>()
    const loading = ref(false)
    const isError = ref(false)
    const isPlaying = ref(false)

    const { onEvent } = useAudio(player)

    const audioSource: ComputedRef<string> = computed(() => {
      if (isArray(props.src)) return (props.src as AudioSource[])?.[0]?.src || ''
      return props.src as string
    })

    const audioInfo: ComputedRef<AudioSource> = computed(() => {
      if (isArray(props.src)) return (props.src as AudioSource[])?.[0] || null
      return null
    })

    const initPlayer = () => {
      if (audioSource.value) {
        onEvent(player.value, [audioEvent.PLAY], () => {
          isPlaying.value = true
        })
        onEvent(player.value, [audioEvent.PAUSE], () => {
          isPlaying.value = false
        })
        onEvent(player.value, [audioEvent.ERROR], () => {
          isError.value = true
        })
      } else {
        isError.value = true
      }
    }

    onMounted(() => {
      initPlayer()
    })

    const play = () => {
      player.value.play()
    }

    const pause = () => {
      player.value.pause()
    }

    const changePlayOrPause = () => {
      if (isPlaying.value) {
        pause()
      } else {
        play()
      }
    }

    provideAudioContext({
      player,
      loading,
      isPlaying,
      play,
      pause
    })

    return () => {
      return (
        <div class={prefixCls}>
          <audio ref={player} src={audioSource.value} controls />
          <div class={`${prefixCls}-body`}>
            <div class={`${prefixCls}-pic`} onClick={changePlayOrPause}>
              <div class={`${prefixCls}-button ${isPlaying.value ? 'pause' : 'play'}`}>
                <i class={`playerfont ${isPlaying.value ? 'player-Pause' : 'player-Play'}`} />
              </div>
            </div>
            <div class={`${prefixCls}-info`}>
              <div class={`${prefixCls}-music`}>
                <div class={`${prefixCls}-title`}>{audioInfo.value?.name || '默认'}</div>
                {!!audioInfo.value?.author && (
                  <div class={`${prefixCls}-author`}>{audioInfo.value?.author}</div>
                )}
              </div>
              <div class={`${prefixCls}-controls`}>
                <Progress prefixCls={prefixCls} />
                <Time prefixCls={prefixCls} />
              </div>
            </div>
          </div>
          <div class={`${prefixCls}-list`}></div>
        </div>
      )
    }
  }
})

export default GPlayerAudio
