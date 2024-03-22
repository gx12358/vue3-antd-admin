export const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型'
}

export const rules = {
  name: [
    { required: true, message: '请输入仓库名称' }
  ],
  url: [
    { required: true, message: '请选择' }
  ],
  owner: [
    { required: true, message: '请选择管理员' }
  ],
  approver: [
    { required: true, message: '请选择审批员' }
  ],
  dateRange: [
    { required: true, message: '请选择生效日期' }
  ],
  type: [
    { required: true, message: '请选择仓库类型' }
  ],
  name2: [
    { required: true, message: '请输入任务名' }
  ],
  url2: [
    { required: true, message: '请输入任务描述' }
  ],
  owner2: [
    { required: true, message: '请选择执行人' }
  ],
  approver2: [
    { required: true, message: '请选择责任人' }
  ],
  dateRange2: [
    { required: true, message: '请输入生效时间' }
  ],
  type2: [
    { required: true, message: '请选择仓库类型' }
  ]
}
