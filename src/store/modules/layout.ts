import type { PiniaStoreValue } from '@gx-design-vue/pro-hooks'
import type { ProLayoutConfig } from '@gx-design-vue/pro-provider'
import logo from '@/assets/logo.png'
import { defaultSettings, theme } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { BasicLayoutProps, handleThemeConfig } from '@gx-design-vue/pro-layout'
import { themeConfig } from '@gx-design-vue/pro-provider'
import { defineStore } from 'pinia'
import { toRefs } from 'vue'

const layoutConfig: ProLayoutConfig = {
  ...themeConfig,
  title: defaultSettings.title
}

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-layout 全局属性
 */
export interface LayoutState {
  settings: BasicLayoutProps;
}

type LayoutStoreValue = PiniaStoreValue<LayoutState>

export const useStoreLayout = defineStore<'layout', LayoutStoreValue>('layout', () => {
  const [ state, setValue ] = useReactiveState<LayoutState>({
    settings: {
      logo,
      ...handleThemeConfig({ ...layoutConfig, primaryColor: theme.colorPrimary }),
    },
  })

  return {
    ...toRefs(state),
    setValue
  } as LayoutStoreValue
})
