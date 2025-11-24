import type { ProAliasToken } from '@gx-design-vue/pro-provider'
import type { CSSObject } from 'ant-design-vue'
import type { GenerateStyle } from 'ant-design-vue/es/theme/internal'

export const genFileTypeIconStyle: GenerateStyle<ProAliasToken> = (token): CSSObject => {
  return {
    [token.componentCls]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '&-svg': {
        position: 'relative',
        lineHeight: 1,
        flex: 'none'
      }
    }
  }
}
