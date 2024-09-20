import { useClipboard as useClipboardVue } from '@vueuse/core'
import { message } from 'ant-design-vue'
import { watchEffect } from 'vue'

export default function useClipboard(msg?: string) {
  const { text, copy, copied } = useClipboardVue()

  watchEffect(() => {
    if (copied.value && msg && text.value) {
      message.success(msg)
    }
  })

  return { copy, copied, text }
}
