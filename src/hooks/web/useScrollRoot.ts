import { defaultSettings } from '@gx-config'

export default function () {
  const { system } = defaultSettings

  const scrollRoot = ref<HTMLElement>()

  onMounted(() => {
    scrollRoot.value = document.querySelector(`${system.viewScrollRoot}>.gx-scrollbar-view`) as HTMLElement
  })

  return scrollRoot as Ref<HTMLElement>
}
