import type { Theme } from '@unocss/preset-uno'
import type { UserConfig } from 'unocss'
import { deepMerge } from '@gx-design-vue/pro-utils'
import {
  presetAttributify,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
  defineConfig as unocssDefineConfig
} from 'unocss'
import { colors } from './css-var'
import { rules } from './rule'

function defineConfig<T extends object = Theme>(config: UserConfig<T> = {}): UserConfig<T> {
  const mergeConfig = deepMerge(config, {
    presets: [
      presetWind3(),
      presetAttributify()
    ],
    extendTheme: (theme) => {
      return {
        ...theme,
        colors,
        breakpoints: {
          ...theme.breakpoints,
          notebook: '1366px',
          xxl: '1440px',
        },
      }
    },
    transformers: [ transformerDirectives({
      applyVariable: [ '--at-apply' ]
    }), transformerVariantGroup() ],
    shortcuts: [
      {
        'w-h-full': 'w-full h-full',
        'flex-y': 'flex flex-col',
        'flex-x-center': 'flex items-center',
        'flex-y-center': 'flex items-center flex-col',
        'flex-center': 'flex items-center justify-center',
        'flex-col-center': 'flex items-center justify-center flex-col',
        'flex-between': 'flex items-center justify-between',
        'text-btn-error': 'text-error cursor-pointer hover:text-error-hover',
      },
    ],
    rules: rules([])
  })

  return unocssDefineConfig<T>(mergeConfig)
}

export { defineConfig }

export * from './css-var'
export * from './rule'
