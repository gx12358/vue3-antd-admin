import { defineComponent, onMounted, ref } from 'vue'
import { useVideoContext } from '../context'
import useVideo from '../hooks/useVideo'
import videoEvent from '../utils/event'

const Loading = defineComponent({
  name: 'Loading',
  props: {
    prefixCls: String as VuePropType<string>
  },
  setup(props, { expose }) {
    const { player, loading, changeLoading } = useVideoContext()

    const _timeout = ref()

    const { onEvent, removeAllEvent } = useVideo(player)

    const showLoading = (isForce?: boolean) => {
      if (isForce) {
        changeLoading(true)
        return
      }
      window.clearTimeout(_timeout.value)
      _timeout.value = setTimeout(() => {
        changeLoading(true)
      }, 600)
    }

    const hideLoading = () => {
      window.clearTimeout(_timeout.value)
      changeLoading(false)
    }

    onMounted(() => {
      onEvent(
        player.value,
        [
          videoEvent.ERROR,
          videoEvent.SEEKED,
          videoEvent.CANPLAY,
          videoEvent.PLAYING,
          videoEvent.CANPLAYTHROUGH,
          videoEvent.LOADEDMETADATA
        ],
        hideLoading
      )
      onEvent(
        player.value,
        [ videoEvent.STALLED, videoEvent.SEEKING, videoEvent.LOADSTART ],
        showLoading
      )
    })

    expose({
      remove: removeAllEvent
    })

    return () => {
      return (
        <div
          style={loading.value ? undefined : { display: 'none' }}
          class={{
            [`${props.prefixCls}-layer`]: true,
            [`${props.prefixCls}-loading`]: true
          }}
        >
          <div class={`${props.prefixCls}-loading-wrapper`}>
            <div class="playerfont player-jiazai" />
            <div>加载中...</div>
          </div>
        </div>
      )
    }
  }
})

export default Loading
