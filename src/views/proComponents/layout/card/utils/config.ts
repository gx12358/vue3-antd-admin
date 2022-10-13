export const links = [
  {
    link: '#proCard',
    name: '高级卡片'
  },
  {
    link: '#basicCard',
    level: 2,
    name: '基础卡片'
  },
  {
    link: '#gridCard',
    level: 2,
    name: '栅格布局'
  },
  {
    link: '#responsiveCard',
    level: 2,
    name: '响应式'
  },
  {
    link: '#splitCard',
    level: 2,
    name: '卡片切分'
  },
  {
    link: '#columnsCard',
    level: 2,
    name: '左右分栏'
  },
  {
    link: '#complexSplitCard',
    level: 2,
    name: '复杂切分'
  },
  {
    link: '#gridSpaceCard',
    level: 2,
    name: '栅格间隔'
  },
  {
    link: '#multiLineCard',
    level: 2,
    name: '多行卡片'
  },
  {
    link: '#groupCard',
    level: 2,
    name: '分组展示'
  },
  {
    link: '#headerDivider',
    level: 2,
    name: '标题带分割线'
  },
  {
    link: '#collapsedCard',
    level: 2,
    name: '可折叠'
  },
  {
    link: '#deckExpandCard',
    level: 2,
    name: '卡片组展开'
  },
  {
    link: '#centerCard',
    level: 2,
    name: '内容居中'
  },
  {
    link: '#loadingCard',
    level: 2,
    name: '加载中'
  },
  {
    link: '#actionsCard',
    level: 2,
    name: '操作项'
  },
  {
    link: '#hideTitleCard',
    level: 2,
    name: '无标题'
  },
  {
    link: '#borderedCard',
    level: 2,
    name: '带边框'
  },
  {
    link: '#hoverableCard',
    level: 2,
    name: '浮出效果'
  },
  {
    link: '#tabsCard',
    level: 2,
    name: '页签'
  },
  {
    link: '#cardTab',
    level: 2,
    name: '卡片式页签'
  },
  {
    link: '#innerCard',
    level: 2,
    name: '内部卡片'
  },
  {
    link: '#stepsCard',
    level: 2,
    name: '竖向步骤示例'
  },
  {
    link: '#basicApi',
    name: 'Api'
  },
  {
    link: '#proCardTabs',
    level: 2,
    name: 'ProCardTabs'
  },
  {
    link: '#proCardTabPane',
    level: 2,
    name: 'ProCard.TabPane'
  },
  {
    link: '#proCardTabDivider',
    level: 2,
    name: 'ProCard.Divider'
  },
  {
    link: '#proCardTabGroup',
    level: 2,
    name: 'ProCard.Group'
  }
]

export const basicData = [
  {
    attributes: 'title',
    description: '标题',
    typesof: 'string | slot',
    defaults: ''
  },
  {
    attributes: 'subTitle',
    description: '副标题',
    typesof: 'string | slot',
    defaults: ''
  },
  {
    attributes: 'tooltipText',
    description: '标题右侧图标 hover 提示信息',
    typesof: 'string | slot',
    defaults: ''
  },
  {
    attributes: 'tooltipIcon',
    description: '标题右侧图标',
    typesof: 'string | slot',
    defaults: ''
  },
  {
    attributes: 'extra',
    description: '右上角自定义区域',
    typesof: 'string | slot',
    defaults: ''
  },
  {
    attributes: 'layout',
    description: '内容布局，支持垂直居中',
    typesof: 'default | center',
    defaults: 'default'
  },
  {
    attributes: 'loading',
    description: '加载中，支持自定义 loading 样式',
    typesof: 'boolean | slot',
    defaults: 'false'
  },
  {
    attributes: 'colSpan',
    description: '栅格布局宽度，24 栅格，支持指定宽度 px 或百分比, 支持响应式的对象写法 { xs: 8, sm: 16, md: 24}, 仅在嵌套的子卡片上设置有效。',
    typesof: 'number | string',
    defaults: '24'
  },
  {
    attributes: 'gutter',
    description: '数字或使用数组形式同时设置 [水平间距, 垂直间距], 支持响应式的对象写法 { xs: 8, sm: 16, md: 24}',
    typesof: 'number | array',
    defaults: '0'
  },
  {
    attributes: 'split',
    description: '拆分卡片的方向',
    typesof: 'vertical | horizontal',
    defaults: ''
  },
  {
    attributes: 'type',
    description: '卡片类型',
    typesof: 'inner | default',
    defaults: ''
  },
  {
    attributes: 'size',
    description: '卡片尺寸',
    typesof: 'default | small',
    defaults: ''
  },
  {
    attributes: 'actions',
    description: '卡片操作组，位置在卡片底部',
    typesof: 'Array | slot| Array<slot>',
    defaults: ''
  },
  {
    attributes: 'direction',
    description: '指定 Flex 方向，仅在嵌套子卡片时有效，默认方向为 row 横向',
    typesof: 'column',
    defaults: ''
  },
  {
    attributes: 'wrap',
    description: '是否支持换行，仅在嵌套子卡片时有效',
    typesof: 'false',
    defaults: ''
  },
  {
    attributes: 'ghost',
    description: '幽灵模式，即是否取消卡片内容区域的 padding 和 卡片的背景颜色。',
    typesof: 'boolean',
    defaults: 'false'
  },
  {
    attributes: 'headerBordered',
    description: '页头是否有分割线',
    typesof: 'boolean',
    defaults: 'false'
  },
  {
    attributes: 'collapsed',
    description: '受控属性，是否折叠',
    typesof: 'boolean',
    defaults: 'false'
  },
  {
    attributes: 'collapsible',
    description: '配置是否可折叠，受控时无效',
    typesof: 'boolean',
    defaults: 'false'
  },
  {
    attributes: 'defaultCollapsed',
    description: '默认折叠, 受控时无效',
    typesof: 'boolean',
    defaults: 'false'
  },
  {
    attributes: 'onCollapse',
    description: '收起卡片的事件，受控时无效',
    typesof: '(collapsed: boolean) => void',
    defaults: ''
  },
  {
    attributes: 'tabs',
    description: '标签页配置',
    typesof: '见下面 ProCardTabs',
    defaults: ''
  }
]

export const proCardTabsData = [
  {
    attributes: 'activeKey',
    description: '当前选中项',
    typesof: 'string',
    defaults: ''
  },
  {
    attributes: 'type',
    description: '页签的基本样式，可选 line、card、editable-card 类型',
    typesof: 'string',
    defaults: 'inline'
  },
  {
    attributes: '回调',
    description: '标题右侧图标 hover 提示信息',
    typesof: '(activeKey: string) => void;',
    defaults: ''
  }
]

export const proCardTabPaneData = [
  {
    attributes: 'key',
    description: '对应 activeKey，用于标定是否选中和 dom 更新，一定不要重复，不然会造成表现异常',
    typesof: 'string',
    defaults: ''
  },
  {
    attributes: 'tab',
    description: '选项卡头显示文字',
    typesof: 'string|slot',
    defaults: ''
  },
  {
    attributes: 'disabled',
    description: '不可用',
    typesof: 'boolean',
    defaults: 'false'
  },
  {
    attributes: 'cardProps',
    description: 'ProCard 卡片属性透传',
    typesof: 'ProCard',
    defaults: ''
  }
]

export const proCardTabDividerData = [
  {
    attributes: 'type',
    description: '分隔类型',
    typesof: 'horizontal | vertical',
    defaults: ''
  }
]
