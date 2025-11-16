import type { ThemeValue } from '@gx-design-vue/pro-layout'
import type { DeepPartial, ProAliasToken, TokenCssVar } from '@gx-design-vue/pro-provider'
import { app } from '@gx-config'
import { getCssVarValue, toggleAnimateTheme } from '@gx-design-vue/pro-layout'
import { useDark, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

const { system } = app

export const useStoreTheme = defineStore('theme', () => {
  const isDark = useDark()

  const theme = useLocalStorage<ThemeValue>(system.theme.storageKey, system.theme.value)

  const getToken = () => {
    const colorBgBase = `hsl(${getCssVarValue('--color-background')})`
    return {
      colorBgBase,
      colorPrimary: `hsl(${getCssVarValue('--color-primary')})`,
      colorText: getCssVarValue('--color-text'),
      colorTextDescription: getCssVarValue('--color-text-secondary'),
      layout: {
        menuItemIconSize: 18
      }
    } as DeepPartial<ProAliasToken>
  }

  const token = ref(getToken())

  // root css var
  const cssVar = ref<TokenCssVar>([])

  function toggle(el?: HTMLElement) {
    if (el) {
      toggleAnimateTheme(el, {
        isDark: !isDark.value,
        setTheme: (value) => {
          theme.value = value
        }
      })
    } else {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    }
  }

  function reloadToken() {
    token.value = getToken()
  }

  return {
    theme,
    cssVar,
    isDark,
    token,
    toggle,
    reloadToken,
    getToken
  }
})
