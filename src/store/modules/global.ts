import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { ThemeConfig } from '@gx-design-vue/pro-provider'
import { themeConfig as proThemeConfig } from '@gx-design-vue/pro-provider'
import type { BasicLayoutProps } from '@gx-design-vue/pro-layout'
import { handleThemeConfig } from '@gx-design-vue/pro-layout'
import { defaultSettings, theme } from '@gx-config'
import logo from '@/assets/logo.png'

const layoutThemeConfig = {
  ...proThemeConfig,
  title: defaultSettings.title,
} as ThemeConfig

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-global 全局属性
 */
export interface GlobalState {
  isLogut: boolean;
  settings: {
    layout: BasicLayoutProps;
    keepAlive: boolean;
    showProgressBar: boolean;
    disabledScrollTop: boolean;
  };
}

type GlobalStateKey = keyof GlobalState

export const useStoreGlobal = defineStore('global', () => {
  const state = reactive<GlobalState>({
    settings: {
      layout: {
        logo,
        ...handleThemeConfig({ ...layoutThemeConfig, primaryColor: theme.colorPrimary })
      },
      keepAlive: true,
      showProgressBar: true,
      disabledScrollTop: false,
    },
    isLogut: false
  })

  const setGlobalData: (params: Partial<Record<GlobalStateKey, GlobalState[GlobalStateKey]>>) => void = (params) => {
    Object.assign(state, params)
  }

  return {
    state,
    setGlobalData
  }
})
