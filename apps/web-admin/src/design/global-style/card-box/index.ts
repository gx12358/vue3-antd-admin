import { unit } from '@gx-design-vue/pro-provider'
import { getPrefixCls } from '@gx-design-vue/pro-utils'

export function cardBoxStyle(token: ProAliasToken & {
  boxShadowCard: string;
}) {
  const base = getPrefixCls({ suffixCls: 'card' })

  return `
    .${base} {
      position: relative;
      background: ${token.colorBgContainer};
      border-radius: ${unit(token.borderRadiusLG)};
      border: ${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}
    }
    .${base}-header {
      padding-inline: ${unit(token.paddingLG)};
      min-height: 56px;
      display: flex;
      align-items: center;
      color: var(--gx-color-text-heading);
      font-weight: 600;
      font-size: ${unit(token.fontSizeLG)};
      border-bottom: 1px solid var(--gx-color-border-secondary);
    }
    .${base}-body {
      padding: ${unit(token.paddingLG)};
    }
    .${base}-actions {
      border-top: ${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}
    }
    .${base}-cover {
      margin-top: -1px;
      margin-inline-start: -1px;
      margin-inline-end: -1px;
    }
    .${base}.hover {
      cursor: pointer;
      transition: box-shadow ${token.motionDurationMid}, border-color ${token.motionDurationMid};
    }
    .${base}.hover:hover {
      border-color: transparent;
      box-shadow: ${token.boxShadowCard};
    }
  `
}
