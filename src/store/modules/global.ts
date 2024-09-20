import type { BasicLayoutProps } from '@gx-design-vue/pro-layout'
import type { ThemeConfig } from '@gx-design-vue/pro-provider'
import logo from '@/assets/logo.png'
import { defaultSettings, theme } from '@gx-config'
import { handleThemeConfig } from '@gx-design-vue/pro-layout'
import { themeConfig as proThemeConfig } from '@gx-design-vue/pro-provider'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

const layoutThemeConfig = {
  ...proThemeConfig,
  title: defaultSettings.title
} as ThemeConfig

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-global 全局属性
 */
export interface GlobalState {
  globalLayout: BasicLayoutProps;
  keepAlive: boolean;
  pageLoading: boolean;
  showProgressBar: boolean;
  disabledScrollTop: boolean;
}

export const useStoreGlobal = defineStore('global', () => {
  const state = reactive<GlobalState>({
    keepAlive: true,
    pageLoading: false,
    showProgressBar: true,
    disabledScrollTop: false,
    globalLayout: {
      logo,
      ...handleThemeConfig({ ...layoutThemeConfig, primaryColor: theme.colorPrimary })
    }
  })

  return {
    state
  }
})
