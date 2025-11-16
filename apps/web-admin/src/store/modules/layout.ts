import type { BasicLayoutProps, ProLayoutExpose } from '@gx-design-vue/pro-layout'
import { app } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { defaultSettings } from '@gx-design-vue/pro-layout'
import { defineStore } from 'pinia'
import { ref, toRefs } from 'vue'
import { useStoreTheme } from './theme'

const { waterMark, title } = app.system

export const layoutConfig: SystemLayoutConfig = {
  ...defaultSettings,
  title,
  layout: 'side',
  progress: true,
  colorWeak: false
}

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-layout 全局属性
 */
/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-layout 全局属性
 */
export interface LayoutState {
  config: Omit<BasicLayoutProps, 'settings'> & {
    settings: SystemLayoutConfig
  };
}

export const useStoreLayout = defineStore('layout', () => {
  const storeTheme = useStoreTheme()

  const proLayout = ref<ProLayoutExpose>()

  const [ state, setValue ] = useReactiveState<LayoutState>({
    config: {
      logo: new URL('/img/logo.png', import.meta.url).href,
      waterMark: waterMark.use ? { content: waterMark.content } : false,
      cssVar: storeTheme.cssVar,
      token: storeTheme.token,
      settings: layoutConfig
    }
  })

  watch(() => storeTheme.isDark, () => {
    storeTheme.reloadToken()
    setValue({
      config: {
        token: storeTheme.getToken()
      }
    })
  })

  return {
    ...toRefs(state),
    setValue,
    proLayout
  }
})
