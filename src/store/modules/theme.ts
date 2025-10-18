import type { ThemeValue } from '@gx-design-vue/pro-layout'
import type { DeepPartial, ProAliasToken } from '@gx-design-vue/pro-provider'
import { defaultSettings } from '@gx-config'
import { getCssVarValue, toggleAnimateTheme } from '@gx-design-vue/pro-layout'
import { useDark, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useStoreLayout } from './layout'

const { system } = defaultSettings

export const useStoreTheme = defineStore('theme', () => {
  const storeLayout = useStoreLayout()

  const isDark = useDark()

  const theme = useLocalStorage<ThemeValue>(system.theme.storageKey, system.theme.value)

  const getToken = () => {
    const colorBgBase = `hsl(${getCssVarValue('--color-background')})`
    return {
      colorBgBase,
      colorPrimary: `hsl(${getCssVarValue('--color-primary')})`,
      colorText: getCssVarValue('--color-text'),
      colorTextDescription: getCssVarValue('--color-text-secondary'),
    } as DeepPartial<ProAliasToken>
  }

  const token = ref(getToken())

  // root css var
  const cssVar = ref<(keyof ProAliasToken)[]>([
    'colorPrimary',
    'colorSuccess',
    'colorError',
    'colorWarning',
    'colorBgLayout',
    'colorBgContainer',
    'colorText',
    'colorTextDescription',
    'colorBorder',
    'colorSplit',
    'colorPrimaryHover',
    'colorErrorHover',
    'colorWarningBgHover',
    'colorPrimaryActive',
    'colorErrorActive',
    'colorWarningActive',
    'colorPrimaryBorder',
    'colorErrorBorder',
    'colorWarningBorder',
    'colorPrimaryBorderHover',
    'colorWarningBorderHover',
    'colorErrorBorderHover',
    'colorPrimaryBg',
    'colorWarningBg',
    'colorErrorBg',
    'colorPrimaryBgHover',
    'colorWarningBgHover',
    'colorErrorBgHover',
  ])

  watch(() => isDark.value, () => {
    token.value = getToken()
    storeLayout.setValue({
      config: {
        token: getToken()
      }
    })
  })

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

  return {
    theme,
    cssVar,
    isDark,
    token,
    toggle
  }
})
