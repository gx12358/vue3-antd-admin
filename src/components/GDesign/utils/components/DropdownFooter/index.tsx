import type { FunctionalComponent } from 'vue'
import { getPrefixCls } from '@gx-admin/utils'

import './index.less'

type LightFilterFooterRender =
  | ((
      onConfirm?: (e?: MouseEvent) => void,
      onClear?: (e?: MouseEvent) => void
    ) => JSX.Element | false)
  | false

type OnClick = (e?: MouseEvent) => void

export type DropdownFooterProps = {
  onClear?: OnClick
  onConfirm?: OnClick
  disabled?: boolean
  footerRender?: LightFilterFooterRender
}

const DropdownFooter: FunctionalComponent<DropdownFooterProps> = (props) => {
  const { onClear, onConfirm, disabled, footerRender } = props
  const prefixCls = getPrefixCls({
    suffixCls: 'core-dropdown-footer',
    isPor: true
  })
  const defaultFooter = [
    <a-button
      key="clear"
      style={{
        visibility: onClear ? 'visible' : 'hidden'
      }}
      type="link"
      size="small"
      disabled={disabled}
      onClick={(e) => {
        if (onClear) {
          onClear(e)
        }
        e.stopPropagation()
      }}
    >
      清除
    </a-button>,
    <a-button
      key="confirm"
      data-type="confirm"
      type="primary"
      size="small"
      onClick={onConfirm}
      disabled={disabled}
    >
      确认
    </a-button>
  ]

  if (footerRender === false || footerRender?.(onConfirm, onClear) === false) {
    return null
  }

  const renderDom = footerRender?.(onConfirm, onClear) || defaultFooter

  return (
    <div
      class={prefixCls}
      onClick={(e) =>
        (e.target as Element).getAttribute('data-type') !== 'confirm' && e.stopPropagation()
      }
    >
      {renderDom}
    </div>
  )
}

export default DropdownFooter
