export const rules = {
  name: [
    {
      required: true,
      message: '请输入标题'
    }
  ],
  desc: [
    {
      required: true,
      message: '请选择起止日期',
    },
  ],
}

export const dispatchRules = {
  time: [
    {
      required: true,
      message: '请选择开始时间'
    }
  ]
}

export const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}
