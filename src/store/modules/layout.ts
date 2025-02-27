import type { BasicLayoutProps, ProLayoutExpose } from '@gx-design-vue/pro-layout'
import type { ProLayoutConfig } from '@gx-design-vue/pro-provider'
import logo from '@/assets/logo.png'
import { defaultSettings, theme } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { handleThemeConfig } from '@gx-design-vue/pro-layout'
import { themeConfig } from '@gx-design-vue/pro-provider'
import { defineStore } from 'pinia'

const { waterMark } = defaultSettings.system

export const layoutConfig: Partial<ProLayoutConfig> = {
  ...themeConfig,
  primaryColor: theme.colorPrimary
}

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-layout 全局属性
 */
export interface LayoutState {
  config: BasicLayoutProps
}

export const useStoreLayout = defineStore('layout', () => {
  const proLayoutRef = ref<ProLayoutExpose>()

  const [ state, setValue ] = useReactiveState<LayoutState>({
    config: {
      logo,
      dark: false,
      footerRender: false,
      waterMark: waterMark.use ? { content: waterMark.content } : false,
      settings: handleThemeConfig(layoutConfig)
    }
  })

  return {
    ...state,
    setValue,
    proLayoutRef
  }
})
