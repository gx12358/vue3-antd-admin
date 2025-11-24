import type { ProAliasToken } from '@gx-design-vue/pro-provider'
import type { CSSObject } from 'ant-design-vue'
import type { GenerateStyle } from 'ant-design-vue/es/theme/internal'

export const genMediaViewtyle: GenerateStyle<ProAliasToken> = (token): CSSObject => {
  return {
    [token.componentCls]: {
      '&-player': {
        '&-video': {
          borderRadius: token.borderRadius,
          overflow: 'hidden',
        },
        '&-music': {
          '.aplayer .aplayer-pic .aplayer-play': {
            width: 30,
            height: 30
          },
          '.aplayer .aplayer-pic .aplayer-pause': {
            width: 20,
            height: 20
          },
          '.aplayer-author': {
            display: 'none'
          }
        },
        '&-hidden': {
          opacity: 0,
          visibility: 'hidden'
        },
        '&-error': {
          '.art-video-player.art-mask-show .art-state': {
            display: 'none'
          }
        }
      }
    }
  }
}
