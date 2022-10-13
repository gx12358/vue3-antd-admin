import { RadioGroupChildOption } from 'ant-design-vue/lib/radio/Group'
import { tuple } from '@gx-design/utils'
import { PropTypes } from '@/utils'

const RadioGroupSizeTypes = tuple('large', 'default', 'small')

const RadioGroupOptionTypes = tuple('default', 'button')

export const radioProps = {
  prefixCls: PropTypes.string,
  checked: PropTypes.looseBool,
  disabled: PropTypes.looseBool,
  isGroup: PropTypes.looseBool,
  value: PropTypes.any,
  name: PropTypes.string,
  id: PropTypes.string,
  autofocus: PropTypes.looseBool,
  type: PropTypes.string.def('radio'),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

export const radioGroupProps = {
  prefixCls: PropTypes.string,
  value: PropTypes.any,
  size: PropTypes.oneOf(RadioGroupSizeTypes).def('default'),
  options: {
    type: Array as PropType<Array<String | RadioGroupChildOption>>
  },
  disabled: PropTypes.looseBool,
  name: PropTypes.string,
  buttonStyle: PropTypes.string.def('outline'),
  id: PropTypes.string,
  optionType: PropTypes.oneOf(RadioGroupOptionTypes).def('default')
}
