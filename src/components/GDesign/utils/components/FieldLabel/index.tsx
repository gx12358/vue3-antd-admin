import type { CSSProperties, FunctionalComponent } from 'vue'
import { DownOutlined, CloseOutlined } from '@ant-design/icons-vue'
import type { SizeType } from '@gx-admin/utils'
import { getPrefixCls } from '@gx-admin/utils'

import './index.less'

export type FieldLabelProps = {
  label?: VueNode
  value?: any
  disabled?: boolean
  onClear?: () => void
  size?: SizeType
  ellipsis?: boolean
  placeholder?: VueNode
  expanded?: boolean
  class?: string
  formatter?: (value: any) => string
  style?: CSSProperties
  bordered?: boolean
  allowClear?: boolean
}

const FieldLabel: FunctionalComponent<FieldLabelProps> = (props) => {
  const {
    label,
    onClear,
    value,
    size = 'middle',
    disabled,
    style,
    bordered,
    allowClear = true
  } = props

  const prefixCls = getPrefixCls({
    suffixCls: 'core-field-label',
    isPor: true
  })

  const formatterText = (aValue: any) => {
    if (props.formatter) {
      return props.formatter(aValue)
    }
    return Array.isArray(aValue) ? aValue.join(',') : String(aValue)
  }

  const getTextByValue = (aLabel?: VueNode | VueNode[], aValue?: string | string[]): VueNode => {
    if (
      aValue !== undefined &&
      aValue !== null &&
      aValue !== '' &&
      (!Array.isArray(aValue) || aValue.length)
    ) {
      const prefix = aLabel ? (
        <>
          {aLabel}
          {': '}
        </>
      ) : (
        ''
      )
      const str = formatterText(aValue)
      if (!props.ellipsis) {
        return (
          <span>
            {prefix}
            {formatterText(aValue)}
          </span>
        )
      }

      const getText = () => {
        const isArrayValue = Array.isArray(aValue) && aValue.length > 1
        const unitText = '项'
        if (str.length > 32 && isArrayValue) {
          return `...${aValue.length}${unitText}`
        }
        return ''
      }
      const tail = getText()

      return (
        <span title={str}>
          {prefix}
          {str?.toString()?.substr?.(0, 32)}
          {tail}
        </span>
      )
    }
    return aLabel || props.placeholder
  }

  return (
    <span
      class={{
        [`${prefixCls}`]: true,
        [`${prefixCls}-${size}`]: true,
        [`${prefixCls}-active`]: !!value || value === 0,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-bordered`]: bordered,
        [`${prefixCls}-allow-clear`]: allowClear,
        [`${props.class}`]: props.class
      }}
      style={style}
    >
      {getTextByValue(label, value)}
      {(value || value === 0) && allowClear && (
        <CloseOutlined
          class={[`${prefixCls}-icon`, `${prefixCls}-close`]}
          onClick={(e) => {
            if (onClear && !disabled) {
              onClear()
            }
            e.stopPropagation()
          }}
        />
      )}
      <DownOutlined class={[`${prefixCls}-icon`, `${prefixCls}-arrow`]} />
    </span>
  )
}

export default FieldLabel
