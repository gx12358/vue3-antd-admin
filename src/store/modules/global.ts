import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import type { BasicLayoutProps } from '@gx-design-vue/pro-layout'
import type { ThemeConfig } from '@gx-design-vue/pro-provider'
import { themeConfig as proThemeConfig } from '@gx-design-vue/pro-provider'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-global 全局属性
 */
export interface GlobalState {
  settings: Partial<BasicLayoutProps & { showProgressBar: boolean; keepAlive: boolean; disabledScrollTop: boolean; }>;
  animateSetting: ThemeConfig['animate']
}

type GlobalStateKey = keyof GlobalState

export const useStoreGlobal = defineStore('global', () => {
  const state = reactive<GlobalState>({
    settings: {
      disabledScrollTop: false,
      keepAlive: true,
      showProgressBar: true,
    },
    animateSetting: proThemeConfig.animate as ThemeConfig['animate']
  })

  const setGlobalData: (params: Partial<Record<GlobalStateKey, GlobalState[GlobalStateKey]>>) => void = (params) => {
    Object.assign(state, params)
  }

  return {
    ...toRefs(state),
    setGlobalData
  }
})
