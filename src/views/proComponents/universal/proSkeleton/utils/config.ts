export default {
  basicData: [
    {
      attributes: 'loading',
      description: '为 true 时，显示占位图。反之则直接展示子组件',
      typesof: 'boolean',
      defaults: ''
    },
    {
      attributes: 'active',
      description: '是否展示动画效果',
      typesof: 'boolean',
      defaults: 'false'
    },
    {
      attributes: 'shape',
      description: '指定按钮的形状',
      typesof: 'circle | round | default',
      defaults: ''
    },
    {
      attributes: 'size',
      description: '设置按钮的大小',
      typesof: 'large | small | default',
      defaults: ''
    },
  ],
  proSkelectonData: [
    {
      attributes: 'type',
      description: '不同类型的骨架屏',
      typesof: `'list' | 'result' | 'descriptions'`,
      defaults: 'list'
    },
    {
      attributes: 'active',
      description: '是否显示动态',
      typesof: 'boolean',
      defaults: 'true'
    },
    {
      attributes: 'pageHeader',
      description: '是否显示 pageHeader 的骨架屏 descriptions 和 list 有效',
      typesof: '',
      defaults: ''
    },
    {
      attributes: 'statistic',
      description: '统计信息骨架屏的数量',
      typesof: 'number | false',
      defaults: ''
    },
    {
      attributes: 'list',
      description: '列表的骨架屏，可以控制数量',
      typesof: 'number | false',
      defaults: ''
    },
    {
      attributes: 'toolbar',
      description: '列表的操作栏骨架屏',
      typesof: 'boolean',
      defaults: ''
    },
  ],
}
