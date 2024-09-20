import type { Ref } from 'vue'
import { off, on } from '@gx-design-vue/pro-utils'
import { onBeforeUnmount, onDeactivated, reactive } from 'vue'

function useAudio(player: Ref<HTMLAudioElement>) {
  const eventRef = reactive({})

  function onEvent(el, event: string[], callback) {
    event.forEach((item) => {
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

export default useAudio
