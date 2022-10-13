export default {
  requestCode: `<g-pro-table
  // params 是需要自带的参数
  // 这个参数优先级更高，会覆盖查询表单的参数
  :params={params}
  // getTableData为自定义函数
  :request={(params, sort, filter) => getTableData(params, sort, filter)}
/>`,
  searchDataCode: `[
  {
    name: 'name',
    valueType: 'text',
    placeholder: '请输入', // 表单项placeholder
    allowClear: true,
    defaultValue: ''
  },
  {
    name: 'age',
    valueType: 'select', // 映射不同的表单项（select）
    placeholder: '请选择',
    valueEnum: [
      {
        text: '全部', value: 'Default'
      },
      {
        text: '好', value: 'hao'
      }
    ],
    showSearch: true,
    allowClear: true,
    defaultValue: undefined
  },
  {
    name: 'date',
    valueType: 'date', // 映射不同的表单项（DatePicker）
    placeholder: '请选择',
    format: 'YYYY-MM-DD HH:mm:ss',
    defaultValue: '2021-07-19 18:21:21',
    allowClear: true,
    showTime: true,
    showToday: true
  },
  {
    name: 'dateMonth',
    valueType: 'dateMonth', // 映射不同的表单项（MonthPicker）
    placeholder: '请选择',
    allowClear: true,
    defaultValue: '2021-07'
  },
  {
    name: 'dateRange',
    rangeStartName: 'start',
    rangeEndName: 'end',
    valueType: 'dateRange', // 映射不同的表单项（RangePicker）
    placeholder: '请选择',
    allowClear: true,
    defaultValue: '2021-07',
    format: 'YYYY-MM-DD HH:mm:ss',
    showTime: true,
  },
  {
    name: 'time',
    valueType: 'time', // 映射不同的表单项（TimePicker）
    placeholder: '请选择',
    allowClear: true,
    defaultValue: '15:21:12',
    format: 'YYYY-MM-DD HH:mm:ss',
    use12Hours: true
  }
]`,
  searchColConfig: `const defaultColConfig = {
  xs: 1,
  sm: 2,
  md: 2,
  lg: 2,
  xl: 3,
  xxl: 4
};`,
  searchSlotsCode: `<template #search>
  <g-input-search
    v-model:searchValue="tableParameters.title"
    :actionRef="info => inputSearchRef = info"
    allow-clear
    placeholder="请输入标题"
    style="width: 100%"
  >
    <template #enterButton>
      <a-button>
        <SearchOutlined />
      </a-button>
    </template>
  </g-input-search>
  <a-select
    v-model:value="tableParameters.source"
    placeholder="请选择来源"
    allow-clear
    style="width: 100%"
  >
    <a-select-option value="平台生产">
      平台生产
    </a-select-option>
    <a-select-option value="中央厨房">
      中央厨房
    </a-select-option>
    <a-select-option value="海豚云">
      海豚云
    </a-select-option>
    <a-select-option value="文稿爬取">
      文稿爬取
    </a-select-option>
  </a-select>
</template>`,
  searchColumnsCode: `[
  {
    dataIndex: 'name',
    ellipsis: true,
    key: 'name',
    width: 150,
    searchConfig: {
      name: 'name',
      valueType: 'text',
      placeholder: '请输入'
    }
  },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 150 },
  { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
  { title: 'Column 2', dataIndex: 'address', key: '2' },
  { title: 'Column 3', dataIndex: 'address', key: '3' },
  { title: 'Column 4', dataIndex: 'address', key: '4' },
  { title: 'Column 5', dataIndex: 'address', key: '5' },
  { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
  {
    title: 'Action',
    ellipsis: true,
    width: 150,
    copyable: true,
    key: 'operation',
    dataIndex: 'operation'
  }
]`,
  searchData: [
    {
      name: 'name',
      valueType: 'text',
      placeholder: '请输入'
    },
    {
      name: 'age',
      valueType: 'select',
      placeholder: '请选择',
      valueEnum: [
        {
          text: '全部', value: 'Default'
        },
        {
          text: '好', value: 'hao'
        }
      ]
    },
    {
      name: 'date',
      valueType: 'date',
      placeholder: '请选择',
      format: 'YYYY-MM-DD HH:mm:ss',
      defaultValue: '2021-07-19 18:21:21'
    },
    {
      name: 'dateMonth',
      valueType: 'dateMonth',
      placeholder: '请选择'
    },
    {
      name: 'dateRange',
      rangeStartName: 'start',
      rangeEndName: 'end',
      valueType: 'dateRange',
      placeholder: '请选择'
    },
    {
      name: 'time',
      valueType: 'time',
      placeholder: '请选择'
    }
  ],
  proTableData: [
    {
      attributes: 'request',
      description: '获取 dataSource 的方法',
      typesof: '(params?: {pageSize,current},sort,filter) => {data,success,total}',
      defaults: ''
    },
    {
      attributes: 'params',
      description: '用于 request 查询的额外参数，一旦变化会触发重新加载',
      typesof: 'Object',
      defaults: ''
    },
    {
      attributes: 'search',
      description: '是否显示搜索表单，传入对象时为搜索表单的配置',
      typesof: 'false | SearchConfig',
      defaults: `{ resetText: '重置', searchText: '查询' }`
    },
    {
      attributes: 'searchMap',
      description: '搜索表单数据项（可结合columns对应的searchConfig、slot-search一起展示）',
      typesof: 'ProSearchMap',
      defaults: '[]'
    },
    {
      attributes: 'actionRef',
      description: 'Table action 的引用，便于自定义触发',
      typesof: '(reload, reloadAndRest) => {reload,reloadAndRest}',
      defaults: ''
    },
    {
      attributes: 'toolBarBtn',
      description: '渲染 Pro Table 操作按钮组（数组jsx形式）',
      typesof: '(reload, reloadAndRest) => {reload,reloadAndRest}',
      defaults: '[]'
    },
    {
      attributes: 'tableClassName',
      description: '封装的 Pro Table 的 className',
      typesof: 'String',
      defaults: ''
    },
    {
      attributes: 'tableStyle',
      description: '封装的 Pro Table 的 style',
      typesof: 'Object',
      defaults: '{}'
    },
    {
      attributes: 'options',
      description: 'Pro Table 工具栏，设为 false 时不显示',
      typesof: '{{ fullScreen: Boolean | Function, reload: Boolean | Function,setting: true, density?: Boolean }}',
      defaults: '{ fullScreen: false, reload:true, setting: true, density: true}'
    },
    {
      attributes: 'optionsExtra',
      description: 'Pro Table 工具栏额外元素',
      typesof: 'slots',
      defaults:'-'
    },
    {
      attributes: 'columnsState',
      description: '受控的列状态，可以操作显示隐藏',
      typesof: 'ColumnsStateType',
      defaults:'-'
    },
    {
      attributes: 'showIndex',
      description: '是否展示序号Index',
      typesof: 'Boolean',
      defaults: 'true'
    },
    {
      attributes: 'headerTitle',
      description: 'Pro Table 的 Title',
      typesof: 'Function | String',
      defaults: ''
    },
    {
      attributes: 'align',
      description: '设置Pro Table 的 align（以columns中align属性为主）',
      typesof: 'String',
      defaults: 'left'
    },
    {
      attributes: 'titleTip',
      description: 'Pro Table 的 tooltip',
      typesof: 'Function | String',
      defaults: ''
    },
    {
      attributes: 'titleTipText',
      description: 'Pro Table 的 tooltip 提示文字',
      typesof: 'String',
      defaults: '这是一个标题提示'
    },
    {
      attributes: 'size',
      description: 'Pro Table 的大小设置(default | middle | small)',
      typesof: 'String',
      defaults: 'default'
    },
    {
      attributes: 'align',
      description: 'Pro Table 的全局对齐方式',
      typesof: 'String',
      defaults: 'left'
    },
    {
      attributes: 'pageItemRender',
      description: 'Pro Table 的分页可自定义设置(遵循ant-design-vue-Pagination-itemRender属性)',
      typesof: 'slots',
      defaults: '-'
    },
    {
      attributes: 'autoScroll',
      description: 'Pro Table 是否自动判断当前屏幕决定列action是否固定',
      typesof: 'Boolean',
      defaults: 'true'
    },
    {
      attributes: 'scrollBreakpoint',
      description: 'Pro Table 断点配置（用于autoScroll为true）',
      typesof: `'xs'| 'sm' | 'md'| 'lg' | 'xl' | 'xxl' | 'xxl' | Number(屏幕宽度)`,
      defaults: 'xl'
    },
    {
      attributes: 'modalScroll',
      description: 'Pro Table 是否为模态框下的表格（为true时，scroll的Y固定为400/225）',
      typesof: 'Boolean',
      defaults: 'false'
    },
    {
      attributes: 'neverScroll',
      description: 'Pro Table scroll 属性都为undefined，不滚动',
      typesof: 'Boolean',
      defaults: 'false'
    },
    {
      attributes: 'columnEmptyText',
      description: 'Pro Table 列表空值时的显示，不设置时显示 -， false 可以关闭此功能',
      typesof: 'Boolean | String',
      defaults: 'false'
    },
    {
      attributes: 'draggabled',
      description: 'Pro Table 是否可拖拽（对应colums：width必填）',
      typesof: 'Boolean',
      defaults: 'false'
    },
    {
      attributes: 'onReset',
      description: 'Pro Table Form 表单重置触发',
      typesof: '(params) => void',
      defaults: '-'
    },
    {
      attributes: 'onSubmit',
      description: 'Pro Table Form 表单提交触发',
      typesof: '(params) => void',
      defaults: '-'
    },
    {
      attributes: 'onSizeChange',
      description: 'Pro Table 尺寸发生改变',
      typesof: `(size: 'default' | 'middle' | 'small') => void`,
      defaults: '-'
    },
    {
      attributes: 'onLoadingChange',
      description: 'Pro Table 被修改时触发，一般是网络请求导致的',
      typesof: `(loading:Boolean) => void`,
      defaults: '-'
    },
    {
      attributes: 'onRequestError',
      description: 'Pro Table 数据加载失败时触发',
      typesof: `(error) => void`,
      defaults: '-'
    },
    {
      attributes: 'beforeSearchSubmit',
      description: 'Pro Table 搜索之前进行一些修改',
      typesof: `(params: T) => T`,
      defaults: '-'
    },
  ],
  searchTableData: [
    {
      attributes: 'searchText',
      description: '查询按钮的文本',
      typesof: 'String',
      defaults: '查询'
    },
    {
      attributes: 'resetText',
      description: '重置按钮的文本',
      typesof: 'String',
      defaults: '重置'
    },
    {
      attributes: 'span',
      description: '配置查询表单的列数',
      typesof: 'ColConfig',
      defaults: '-'
    },
    {
      attributes: 'className',
      description: '封装的搜索 Form 的 className',
      typesof: 'String',
      defaults: '-'
    },
    {
      attributes: 'showReset',
      description: '是否展示重置按钮',
      typesof: 'Boolean',
      defaults: 'false'
    },
    {
      attributes: 'showSearch',
      description: '是否展示查询按钮',
      typesof: 'Boolean',
      defaults: 'false'
    },
    {
      attributes: 'defaultCollapsed',
      description: '默认是否收起',
      typesof: 'Boolean',
      defaults: 'true'
    },
    {
      attributes: 'collapseRender',
      description: '收起按钮的 render',
      typesof: 'Function',
      defaults: ''
    }
  ],
  searchCommonData: [
    {
      attributes: 'name',
      description: '表格查询参数名',
      typesof: 'String',
      defaults: ''
    },
    {
      attributes: 'valueType',
      description: '映射不同的表单项',
      typesof: 'String（text|select|date|dateMonth|dateRange|time）',
      defaults: ''
    },
    {
      attributes: 'placeholder',
      description: '表单项placeholder',
      typesof: 'String',
      defaults: 'text-请输入|请选择'
    },
    {
      attributes: 'allowClear',
      description: '表单项是否展示清楚按钮',
      typesof: 'Boolean',
      defaults: 'true'
    },
    {
      attributes: 'defaultValue',
      description: '表单项默认值',
      typesof: 'Any',
      defaults: ''
    },
    {
      attributes: 'valueEnum-select',
      description: '值的枚举，会自动转化把值当成 key 来取出要显示的内容',
      typesof: 'Array',
      defaults: '[]'
    },
    {
      attributes: 'showSearch-select',
      description: '表单项是否可搜索',
      typesof: 'Boolean',
      defaults: ''
    },
    {
      attributes: 'format-date|dateMonth|dateRange|time',
      description: '表单项值默认展示格式',
      typesof: 'String',
      defaults: ''
    },
    {
      attributes: 'field',
      description: 'ant表单项配置（支持ant对应的api，除slots方法除外）',
      typesof: 'Object',
      defaults: ''
    },
    {
      attributes: 'showTime-date|dateRange',
      description: '表单项是否增加时间选择功能',
      typesof: 'Object | Boolean',
      defaults: 'Ant TimePicker Options'
    },
    {
      attributes: 'showToday-date',
      description: '表单项是否展示“今天”按钮',
      typesof: 'Boolean',
      defaults: ''
    },
    {
      attributes: 'rangeStartName-dateRange',
      description: '表格查询开始时间参数名',
      typesof: 'String',
      defaults: 'start'
    },
    {
      attributes: 'rangeEndName-dateRange',
      description: '表格查询结束时间参数名',
      typesof: 'String',
      defaults: 'end'
    },
    {
      attributes: 'use12Hours-time',
      description: '使用 12 小时制，为 true 时 format 默认为 h:mm:ss a',
      typesof: 'Boolean',
      defaults: ''
    }
  ],
  columnsTableData: [
    {
      attributes: 'search',
      description: '表单数据配置',
      typesof: 'ProSearchConfig',
      defaults: ''
    },
    {
      attributes: 'ellipsis',
      description: '是否自动缩略（为true时展示tooltip）',
      typesof: 'Boolean',
      defaults: ''
    },
    {
      attributes: 'copyable',
      description: '是否支持复制',
      typesof: 'Boolean',
      defaults: ''
    }
  ],
  anchorLinks: [
    {
      link: '#g-pro-table',
      name: 'ProTable'
    },
    {
      link: '#g-pro-table-api',
      name: 'API'
    },
    {
      link: '#request-api',
      level: 2,
      name: 'request'
    },
    {
      link: '#proTable-api',
      level: 2,
      name: 'ProTable'
    },
    {
      link: '#search-SearchConfig',
      level: 2,
      name: 'Search'
    },
    {
      link: '#search-colConfig',
      level: 3,
      name: 'Search：ColConfig'
    },
    {
      link: '#search-type-dataSouce',
      level: 3,
      name: 'Search：SearchMap'
    },
    {
      link: '#search-type-slots',
      level: 3,
      name: 'Search：Slots'
    },
    {
      link: '#search-type-columns',
      level: 3,
      name: 'Search：Columns'
    },
    {
      link: '#search-proSearchMap',
      level: 3,
      name: 'Search：ProSearchMap'
    },
    {
      link: '#columns-api',
      level: 2,
      name: 'Columns 列定义'
    }
  ],
  typesof : [ 'SearchConfig', 'ProSearchMap' ]
}
