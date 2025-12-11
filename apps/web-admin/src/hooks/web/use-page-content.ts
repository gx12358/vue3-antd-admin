import { unit, useProConfigContext } from '@gx-design-vue/pro-provider'
import { layoutConfig } from '@/store/modules/layout'

export function usePageContent(h: number = 0) {
  const { token } = useProConfigContext()

  const height = computed(() => {
    const headerHeight = (token.value?.layout?.header?.heightLayoutHeader || layoutConfig.headerHeight) ?? 48
    const marginBlockPageContainerContent = token.value?.layout?.pageContainer?.marginBlockPageContainerContent ?? 20
    const paddingBlockPageContainerContent = token.value?.layout?.pageContainer?.paddingBlockPageContainerContent || 0
    const contentOutNumber = paddingBlockPageContainerContent * 2 + marginBlockPageContainerContent * 2

    const parts = [
      headerHeight,
      layoutConfig.showTabsBar ? 40 : 0,
      contentOutNumber,
      h
    ].filter(str => str).map(item => unit(item))

    return `calc(100vh - ${parts.join(' - ')})`
  })

  return height
}
