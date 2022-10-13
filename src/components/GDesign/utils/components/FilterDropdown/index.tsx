import type { FunctionalComponent } from 'vue'
import { Dropdown } from 'ant-design-vue'
import { getPrefixCls } from '@gx-admin/utils'
import type { DropdownFooterProps } from '../DropdownFooter'
import Footer from '../DropdownFooter'
import './index.less'

export type FooterRender =
  | ((
      onConfirm?: (e?: MouseEvent) => void,
      onClear?: (e?: MouseEvent) => void
    ) => JSX.Element | false)
  | false

export type DropdownProps = {
  label?: VueNode
  footer?: DropdownFooterProps
  footerRender?: FooterRender
  padding?: number
  disabled?: boolean
  onVisibleChange?: (visible: boolean) => void
  visible?: boolean
}

const FilterDropdown: FunctionalComponent<DropdownProps> = (props, { slots }) => {
  const { label, footer, disabled, onVisibleChange, visible, footerRender } = props
  const prefixCls = getPrefixCls({
    suffixCls: 'core-field-dropdown',
    isPor: true
  })

  return (
    <Dropdown
      disabled={disabled}
      trigger={['click']}
      visible={visible}
      onVisibleChange={onVisibleChange}
      overlay={
        <div class={`${prefixCls}-overlay`}>
          <div class={`${prefixCls}-content`}>{slots.default?.()}</div>
          {footer && <Footer disabled={disabled} footerRender={footerRender} {...footer} />}
        </div>
      }
    >
      <span class={`${prefixCls}-label`}>{label}</span>
    </Dropdown>
  )
}

export default FilterDropdown
