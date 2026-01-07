import type { BasicLayoutProps } from '@gx-design-vue/pro-layout'
import { app } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { defaultSettings } from '@gx-design-vue/pro-layout'
import { defineStore } from 'pinia'
import { toRefs } from 'vue'
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

  const [ state, setState ] = useReactiveState<LayoutState>({
    config: {
      logo: new URL('/img/logo.png', import.meta.url).href,
      waterMarkProps: waterMark.use
        ? {
          width: 120,
          height: 80,
          offset: [ 80, 100 ]
        }
        : false,
      menu: {
        menuProps: {
          extraInlineIndent: 8
        }
      },
      cssVar: storeTheme.cssVar,
      token: storeTheme.token,
      settings: layoutConfig
    }
  })

  watch(() => storeTheme.isDark, () => {
    storeTheme.reloadToken()
    setState({
      config: {
        token: storeTheme.getToken()
      }
    })
  })

  return {
    ...toRefs(state),
    setState,
  }
})
