import { unit, useProConfigContext } from '@gx-design-vue/pro-provider'
import { layoutConfig } from '@/store/modules/layout'

export function usePageContent(h: number = 0) {
  const { token } = useProConfigContext()

  const height = computed(() => {
    const headerHeight = (token.value?.layout?.header?.heightLayoutHeader || layoutConfig.headerHeight) ?? 48
    const margin = token.value?.layout?.pageContainer?.margin || ''
    const padding = token.value?.layout?.pageContainer?.padding || ''
    const blockMarginStr = `(${margin?.split(' ')?.[0] || unit(0)} * 2)`
    const blockPaddingStr = `(${padding?.split(' ')?.[0] || unit(0)} * 2)`

    const parts = [
      headerHeight,
      layoutConfig.showTabsBar ? 40 : 0,
      blockMarginStr,
      blockPaddingStr,
      h
    ].filter(str => str).map(item => unit(item))

    console.log(`calc(100vh - ${parts.join(' - ')})`)
    return `calc(100vh - ${parts.join(' - ')})`
  })

  return height
}
