import type { CSSObject } from 'ant-design-vue'
import type { GenerateStyle } from 'ant-design-vue/es/theme/internal'
import type { ProAliasToken } from '@gx-design-vue/pro-provider'
import { mergeToken, setAlpha, useStyle as useProStyle } from '@gx-design-vue/pro-provider'

const genStyle: GenerateStyle<ProAliasToken> = (token): CSSObject => {
  return {
    [`${token.componentCls}`]: {
      [`${token.componentCls}-right-content.dark`]: {
        [`${token.componentCls}-header-actions-item`]: {
          '.iconfont,.anticon': {
            color: token.colorWhite
          }
        },
        [`${token.componentCls}-header-actions-avatar`]: {
          '> div': {
            color: token.colorWhite
          }
        },
      },
      '&-header-actions': {
        display: 'flex',
        height: '100%',
        '&-item': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBlock: 0,
          paddingInline: 2,
          color: token.colorTextTertiary,
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: token.borderRadius,

          '> *': {
            paddingInline: 6,
            paddingBlock: 6,
            borderRadius: token.borderRadius,
            '&:hover': {
              backgroundColor: setAlpha(token.colorTextBase, 0.03)
            }
          }
        },
        '&-avatar': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInlineStart: token.padding,
          paddingInlineEnd: token.padding,
          cursor: 'pointer',
          color: token.colorTextTertiary,
          '> div': {
            height: '44px',
            color: token.colorTextTertiary,
            paddingInline: 8,
            paddingBlock: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            lineHeight: '44px',
            borderRadius: token.borderRadius,
            '&:hover': {
              backgroundColor: setAlpha(token.colorTextBase, 0.03)
            }
          }
        }
      }
    }
  }
}

export function useStyle(componentCls: string) {
  return useProStyle('RightContent', (token) => {
    const formTable = mergeToken<ProAliasToken>(token)
    return [ genStyle(formTable) ]
  }, componentCls)
}
