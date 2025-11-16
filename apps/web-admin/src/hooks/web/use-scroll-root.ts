import { app } from '@gx-config'

export default function () {
  const { system } = app

  const scrollRoot = ref<HTMLElement>()

  onMounted(() => {
    scrollRoot.value = document.querySelector(`${system.viewScrollRoot}>.gx-scrollbar-view`) as HTMLElement
  })

  return scrollRoot as Ref<HTMLElement>
}
