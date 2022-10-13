import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import config from '/config/config'
import { MenuTheme, themeConfig } from '/types/config'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-settings 系统配置
 */
export interface SettingsState {
  logo: string | boolean;
  title: themeConfig['title'];
  animate: themeConfig['animate'];
  layout: themeConfig['layout'];
  primaryColor: themeConfig['primaryColor'];
  wideWidth: themeConfig['wideWidth'];
  fixSiderbar: themeConfig['fixSiderbar'];
  fixedHeader: themeConfig['fixedHeader'];
  fixedMultiTab: themeConfig['fixedMultiTab'];
  splitMenus: themeConfig['splitMenus'];
  showTabsBar: themeConfig['showTabsBar'];
  autoHideHeader: themeConfig['autoHideHeader'];
  showProgressBar: themeConfig['showProgressBar'];
  keepAlive: boolean;
  collapse: boolean;
  theme: MenuTheme | undefined;
}

const { logo, title } = config.defaultSettings

const {
  layout,
  theme,
  animate,
  primaryColor,
  splitMenus,
  fixedMultiTab,
  fixedHeader,
  fixSiderbar,
  autoHideHeader,
  showTabsBar,
  showProgressBar
} = config.theme

export const useStoreSettings = defineStore('settings', () => {
  const state = reactive({
    logo,
    title,
    collapse: false,
    theme,
    layout,
    primaryColor,
    animate: animate || {
      name: 'fade',
      direction: 'default'
    },
    splitMenus: layout === 'mix' ? splitMenus : false,
    autoHideHeader,
    showTabsBar: layout === 'simple' || layout === 'wide' ? false : showTabsBar,
    fixedMultiTab: layout === 'simple' || layout === 'wide' ? false : fixedMultiTab,
    fixedHeader: layout === 'mix' || layout === 'wide' ? true : layout === 'simple' ? false : fixedHeader,
    fixSiderbar: layout === 'mix' ? true : layout === 'wide' ? false : fixSiderbar,
    keepAlive: false,
    showProgressBar
  } as SettingsState)

  const toggleCollapse = () => {
    state.collapse = !state.collapse
  }

  const changeAnimateMode = (value: string) => {
    state.animate.name = value
  }

  const changeAnimateDirections = (value: string) => {
    state.animate.direction = value
  }

  const handleShowAnimate = (value: boolean) => {
    state.animate.disabled = value
  }

  const changeValue = (type, value) => {
    state[type] = value
  }

  return {
    ...toRefs(state),
    changeValue,
    toggleCollapse,
    changeAnimateMode,
    handleShowAnimate,
    changeAnimateDirections
  }
})
