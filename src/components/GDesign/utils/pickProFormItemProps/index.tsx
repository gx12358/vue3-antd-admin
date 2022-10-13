const antdFormItemPropsList = [
  'colon',
  'autoLink',
  'extra',
  'hasFeedback',
  'help',
  'htmlFor',
  'initialValue',
  'noStyle',
  'label',
  'labelAlign',
  'labelCol',
  'name',
  'required',
  'rules',
  'validateFirst',
  'validateStatus',
  'validateTrigger',
  'wrapperCol',
  // 我自定义的
  'addonBefore',
  'addonAfter'
]

export default function pickProFormItemProps(props: {}) {
  const attrs = {}
  antdFormItemPropsList.forEach((key) => {
    if (props[key] !== undefined) {
      attrs[key] = props[key]
    }
  })
  return attrs
}
