import type { ProAliasToken } from '@gx-design-vue/pro-provider'
import type { CSSObject } from 'ant-design-vue'
import { unit, useStyle as useProStyle } from '@gx-design-vue/pro-provider'

const fullSize = (): CSSObject => {
  return {
    width: '100%',
    height: '100%'
  }
}

const flecCenter = (): CSSObject => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export const genProUploadStyle = (token: ProAliasToken, radius?: number): CSSObject => {
  const { componentCls, fontSizeLG, colorTextLightSolid } = token

  const borderRadius = radius ?? token.borderRadiusLG

  const iconCls = `${componentCls}-card-item-action`
  return {
    [componentCls]: {
      '&-wrapper': {
        display: 'block',
        width: '100%',

        '&-more': {
          gap: token.marginXS
        }
      },
      '&-select': {
        position: 'relative',
      },
      '&-trigger': {
        ...flecCenter(),
        padding: token.paddingXS,
        cursor: 'pointer',
        backgroundColor: token.colorFillAlter,
        border: `${unit(token.lineWidth)} dashed ${token.colorBorder}`,
        borderRadius,
        transition: `border-color ${token.motionDurationSlow}`,

        '&:hover': {
          borderColor: token.colorPrimary,
        },

        [`&${componentCls}-trigger-disabled`]: {
          cursor: 'not-allowed',
        },
        [`&${componentCls}-trigger-circle`]: {
          borderRadius: '50%',
        },
      },
      '&-descriptions-label': {
        lineHeight: token.lineHeight,
        marginTop: token.margin
      },
      [`${componentCls}-card-list`]: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',

        [`${componentCls}-card-item`]: {
          position: 'relative',
          border: `${unit(token.lineWidth)} solid ${token.colorBorder}`,
          borderRadius,

          [`&${componentCls}-card-item-uploading`]: {
            ...flecCenter(),
          },

          [`&${componentCls}-card-item-circle`]: {
            borderRadius: '50%',

            [`${componentCls}-card-item-container,${componentCls}-card-item-container::before,${componentCls}-card-item-default-render,${token.componentsCls}-image`]: {
              borderRadius: '50%',
            },
          },

          '&-container': {
            position: 'relative',
            ...fullSize(),

            '&:before': {
              content: '""',
              position: 'absolute',
              zIndex: 1,
              inset: 0,
              opacity: 0,
              background: token.colorBgMask,
              borderRadius,
              transition: `all ${token.motionDurationSlow}`,
            },

            '&:hover': {
              '&:before': {
                opacity: 1,
              },

              [`${componentCls}-card-item-actions`]: {
                opacity: 1,
              }
            },

            [`${token.componentsCls}-image`]: {
              ...fullSize(),
              borderRadius,
              backgroundColor: token.colorFillAlter,
            },

            [`${componentCls}-card-item-default-render`]: {
              ...fullSize(),
              ...flecCenter(),
              position: 'relative',
              backgroundColor: token.colorFillAlter,
              fontSize: token.fontSizeHeading3,
              borderRadius,
            },

            [`${componentCls}-card-item-actions`]: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 10,
              width: '100%',
              opacity: 0,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              borderRadius,
              transform: 'translate(-50%, -50%)',
              transition: `all ${token.motionDurationSlow}`,

              [`
                ${iconCls}-view,
                ${iconCls}-download,
                ${iconCls}-delete
              `]: {
                zIndex: 10,
                width: fontSizeLG,
                margin: `0 ${unit(token.marginXXS)}`,
                fontSize: fontSizeLG,
                cursor: 'pointer',
                transition: `all ${token.motionDurationSlow}`,
                color: colorTextLightSolid,

                '&:hover': {
                  color: colorTextLightSolid,
                },

                svg: {
                  verticalAlign: 'baseline',
                },
              },
            },
          },
        }
      }
    }
  }
}

export function useStyle(componentCls: string, borderRadius?: number) {
  return useProStyle('LoginForm', (token) => {
    return [ genProUploadStyle(token, borderRadius) as any ]
  }, componentCls)
}
