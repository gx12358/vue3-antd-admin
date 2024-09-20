import { formatDuraton } from '@gx-design-vue/pro-utils'
import { defineComponent, onMounted, ref } from 'vue'
import { useVideoContext } from '../context'
import useVideo from '../hooks/useVideo'
import videoEvent from '../utils/event'

const Loading = defineComponent({
  props: {
    prefixCls: String as VuePropType<string>
  },
  setup(props, { expose }) {
    const { player, isPlaying, play, pause } = useVideoContext()

    const { onEvent, removeAllEvent } = useVideo(player)

    const duration = ref(0)
    const currentTime = ref(0)

    const timeChange = () => {
      const time = player.value?.currentTime || 0
      if (!time) {
        return
      }
      currentTime.value = time
      const newDuration = player.value?.duration || 0
      if (newDuration !== duration.value) {
        duration.value = newDuration
      }
    }

    const durationChange = () => {
      duration.value = player.value.duration || 0
    }

    onMounted(() => {
      onEvent(player.value, [ videoEvent.TIMEUPDATE ], timeChange)
      onEvent(player.value, [ videoEvent.DURATIONCHANGE ], durationChange)
    })

    expose({
      remove: removeAllEvent
    })

    return () => {
      return (
        <>
          <div class={`${props.prefixCls}-player`}>
            {isPlaying.value ? (
              <i onClick={pause} class="playerfont player-Pause icon"></i>
            ) : (
              <i onClick={play} class="playerfont player-Play icon"></i>
            )}
          </div>
          <div class={`${props.prefixCls}-time`}>
            {formatDuraton(currentTime.value)}
            <span style={{ margin: '0 4px' }}>/</span>
            {formatDuraton(duration.value)}
          </div>
        </>
      )
    }
  }
})

export default Loading
