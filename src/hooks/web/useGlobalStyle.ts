import { unit, useProConfigContext } from '@gx-design-vue/pro-provider'
import { getPrefixCls, getRandomNumber } from '@gx-design-vue/pro-utils'
import { useStyleTag } from '@vueuse/core'

const id = `global_style_${getRandomNumber().uuid(7)}`

export function useGlobalIconStyle() {
  const base = getPrefixCls({ isPor: true, suffixCls: 'actions-icon' })
  const { token } = useProConfigContext()

  const cssStr = computed(() => {
    return `
      .${base} {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: ${unit(token.value.borderRadius)};
        padding-block: 6px;
        padding-inline: 6px;
        color: ${token.value.colorTextTertiary};
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
        color: ${token.value.colorText};
        background: ${token.value.colorBgTextHover};
      }
    `
  })

  useStyleTag(cssStr, {
    id
  })
}
