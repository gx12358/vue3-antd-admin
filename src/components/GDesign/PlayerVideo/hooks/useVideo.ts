import type { Ref } from 'vue'
import { onBeforeUnmount, reactive, onDeactivated } from 'vue'
import { on, off } from '@/utils'

function useVideo(player: Ref<HTMLVideoElement>) {
  const eventRef = reactive({})

  function onEvent(el, event: string[], callback) {
    event.forEach(item => {
      eventRef[item] = callback
      on(el, item, callback)
    })
  }

  function removeAllEvent() {
    for (const item in eventRef) {
      off(player.value, item, eventRef[item])
    }
  }

  onDeactivated(() => removeAllEvent())

  onBeforeUnmount(() => removeAllEvent())

  return {
    onEvent,
    removeAllEvent
  }
}

export default useVideo
