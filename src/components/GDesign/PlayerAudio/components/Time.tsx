import { formatDuraton } from '@gx-design-vue/pro-utils'
import { defineComponent, onMounted, ref } from 'vue'
import { useAudioContext } from '../context'
import useAudio from '../hooks/useAudio'
import audioEvent from '../utils/event'

const Time = defineComponent({
  props: {
    prefixCls: String as VuePropType<string>
  },
  setup(props, { expose }) {
    const { player } = useAudioContext()

    const { onEvent, removeAllEvent } = useAudio(player)

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
      onEvent(player.value, [audioEvent.TIMEUPDATE], timeChange)
      onEvent(player.value, [audioEvent.DURATIONCHANGE], durationChange)
    })

    expose({
      remove: removeAllEvent
    })

    return () => {
      return (
        <div class={`${props.prefixCls}-time`}>
          <div class={`${props.prefixCls}-time_inner`}>
            {formatDuraton(currentTime.value)}
            <span style={{ margin: '0 4px' }}>/</span>
            {formatDuraton(duration.value)}
          </div>
        </div>
      )
    }
  }
})

export default Time
