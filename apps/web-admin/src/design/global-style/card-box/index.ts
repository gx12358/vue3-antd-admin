import { getPrefixCls } from '@gx-design-vue/pro-utils'

export function cardBoxStyle(token: ProAliasToken) {
  const base = getPrefixCls({ suffixCls: 'card-box' })

  return `
    .${base} {
      position: relative;
      background: ${token.colorBgContainer};
      borderRadius: ${token.borderRadiusLG};
    }
  `
}
