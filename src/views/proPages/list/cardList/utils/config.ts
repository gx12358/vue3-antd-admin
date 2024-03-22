export const rules = {
  title: [
    {
      required: true,
      message: '请输入任务名称'
    }
  ],
  createdAt: [
    {
      required: true,
      message: '请选择开始时间',
    },
  ],
  owner: [
    {
      required: true,
      message: '请选择任务负责人',
    },
  ],
  subDescription: [
    {
      required: true,
      message: '请输入至少五个字符的产品描述！',
      min: 5
    },
  ]
}

export const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼'
]

export const cardGridConfig = {
  gutter: [ 16, 16 ],
  colSpan: { xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 }
}
