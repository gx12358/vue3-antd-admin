import type { ProAliasToken } from '@gx-design-vue/pro-provider'
import { unit } from '@gx-design-vue/pro-provider'
import { getPrefixCls } from '@gx-design-vue/pro-utils'

export default function (token: ProAliasToken) {
  const base = getPrefixCls({ isPor: true, suffixCls: 'actions-icon' })

  return `
    .${base} {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border-radius: ${unit(token.borderRadius)};
      padding-block: 6px;
      padding-inline: 6px;
      color: ${token.colorTextTertiary};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: transparent;
      border: unset;
      min-width: 24px;
      width: fit-content;
      cursor: pointer;
      transition: all 150ms;
    }
    .${base}:hover {
      color: ${token.colorText};
      background: ${token.colorBgTextHover};
    }
  `
}
