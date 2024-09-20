import { computed, defineComponent, onMounted, ref } from 'vue'
import { useAudioContext } from '../context'
import useAudio from '../hooks/useAudio'
import audioEvent from '../utils/event'
import { drag, getMatchRangeTime } from '../utils/util'

const Progress = defineComponent({
  props: {
    prefixCls: String as VuePropType<string>
  },
  setup(props, { expose }) {
    const context = useAudioContext()

    const { onEvent, removeAllEvent } = useAudio(context.player)

    const input = ref<HTMLElement>()
    const thumb = ref<HTMLElement>()

    const _dragEl = ref<HTMLElement>()

    const progress = ref(0)
    const bufferProgress = ref(0)
    const preOperationType = ref<'click' | 'move'>('click')
    const currentMoveType = ref()

    const progressStyle = computed(() => {
      if (progress.value === 0 || progress.value === 100 || preOperationType.value === 'click') {
        return `${progress.value}%`
      } else { return `calc(${progress.value}% - 6px)`
}
    })

    function timeUpdate() {
      if (_dragEl.value) {
        return
      }
      const time = context.player.value?.currentTime || 0
      const duration = context.player.value?.duration || 0
      progress.value = Number(((time / duration) * 100).toFixed(2))
    }

    function downLoad() {
      const currentTime = context.player.value?.currentTime || 0
      const bufferTime = getMatchRangeTime(currentTime, context.player.value?.buffered)
      const duration = context.player.value?.duration || 0
      if (bufferTime > 0 && duration > 0) {
        const bufferNumber = Number(((bufferTime / duration) * 100).toFixed(2))
        if (bufferNumber > bufferProgress.value)
          bufferProgress.value = bufferNumber
      }
    }

    function loadstart() {
      const currentTime = context.player.value.currentTime || 0
      const bufferTime = getMatchRangeTime(currentTime, context.player.value.buffered)
      const duration = context.player.value.duration || 0
      const bufferNumber = Number(((bufferTime / duration) * 100).toFixed(2))
      if (bufferNumber > bufferProgress.value)
        bufferProgress.value = bufferNumber
    }

    onMounted(() => {
      onEvent(context.player.value, [ audioEvent.TIMEUPDATE ], timeUpdate)
      onEvent(context.player.value, [ audioEvent.PROGRESS ], downLoad)
      onEvent(context.player.value, [ audioEvent.LOADSTART ], loadstart)
    })

    const seek = (e) => {
      if (currentMoveType.value) {
        currentMoveType.value = null
        return
      }
      preOperationType.value = 'click'
      const _clientRect = e.currentTarget.getBoundingClientRect()
      const left = e.pageX - _clientRect.left
      const maxVal = e.currentTarget.offsetWidth
      const val = ((left / maxVal) * 100).toFixed(2)
      progress.value = Number(val)
      const duration = context.player.value.duration || 0
      context.player.value.currentTime = (left / maxVal) * duration
    }

    const initDrag = (e) => {
      e.preventDefault()
      preOperationType.value = 'move'
      currentMoveType.value = 'start'
      _dragEl.value = thumb.value
      const maxVal = input.value.offsetWidth
      let marginLeft = getComputedStyle(_dragEl.value, null).marginLeft.includes('px')
        ? Number(getComputedStyle(_dragEl.value, null).marginLeft.split('px')[0])
        : Number(getComputedStyle(_dragEl.value, null).marginLeft)
      if (marginLeft) {
        marginLeft = Number.parseFloat(`${marginLeft}`)
      }

      const coor = {
        x: e.pageX - _dragEl.value.offsetLeft + marginLeft,
        y: e.clientY - _dragEl.value.offsetTop,
        maxLeft: maxVal
      }

      const move = function (ev) {
        if (!_dragEl.value) {
          return
        }
        currentMoveType.value = 'move'
        const newCoor = drag(ev, _dragEl.value, coor)
        if (newCoor) {
          const left = newCoor.left
          const val = Number(((left / maxVal) * 100 + 4.5).toFixed(2))
          progress.value = val < 0 ? 0 : val > 100 ? 100 : val
          const duration = context.player.value.duration || 0
          context.player.value.currentTime = (val / 100) * duration
        }
      }

      const stopMove = function () {
        _dragEl.value = null
        currentMoveType.value = 'end'
        document.removeEventListener('mousemove', move, false)
        document.removeEventListener('mouseup', stopMove, false)
      }

      document.addEventListener('mousemove', move, false)
      document.addEventListener('mouseup', stopMove, false)
    }

    const handleMouseDown = e => initDrag(e)

    expose({
      remove: removeAllEvent
    })

    return () => {
      return (
        <div ref={input} class={`${props.prefixCls}-bar`} onClick={seek}>
          <div class={`${props.prefixCls}-bar-wrapper`}>
            <div
              class={`${props.prefixCls}-bar-loaded`}
              style={{ width: `${bufferProgress.value}%` }}
            />
            <div class={`${props.prefixCls}-bar-playered`} style={{ width: progressStyle.value }}>
              <div
                ref={thumb}
                class={`${props.prefixCls}-bar-thumb-drag`}
                onMousedown={handleMouseDown}
              />
            </div>
          </div>
        </div>
      )
    }
  }
})

export default Progress
