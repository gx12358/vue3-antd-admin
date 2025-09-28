import { unit, useProConfigContext } from '@gx-design-vue/pro-provider'
import { useWindowSize } from '@vueuse/core'
import { layoutConfig } from '@/store/modules/layout'

export default function (h?: number) {
  const { height } = useWindowSize()
  const { token } = useProConfigContext()

  const count = computed(() => {
    const header = (token.value?.layout?.header?.heightLayoutHeader || layoutConfig.headerHeight || 48) as number
    const tabsRoute = 40
    const paddingBlockPageContainerContent = token.value?.layout?.pageContainer?.paddingBlockPageContainerContent || 20

    return height.value - header - paddingBlockPageContainerContent * 2 - tabsRoute - (h || 0)
  })

  return {
    str: computed(() => unit(count.value)),
    count
  }
}
