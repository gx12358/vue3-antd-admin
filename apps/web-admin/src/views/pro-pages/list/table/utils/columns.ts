import type { RulesListItem } from '@gx-mock/routers/list/rule.fake'

export const columns: ProColumnsType<RulesListItem, any> = [
  {
    dataIndex: 'name',
    searchConfig: {
      name: 'name',
      valueType: 'text',
      placeholder: '请输入规则名称'
    }
  },
  {
    title: '描述',
    searchConfig: {
      name: 'desc',
      valueType: 'text',
      placeholder: '请输入描述'
    },
    dataIndex: 'desc'
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true
  },
  {
    title: '状态',
    searchConfig: {
      name: 'status',
      valueType: 'select',
      valueEnum: [
        {
          label: '关闭',
          value: '0'
        },
        {
          label: '运行中',
          value: '1'
        },
        {
          label: '已上线',
          value: '2'
        },
        {
          label: '异常',
          value: '3'
        }
      ],
      placeholder: '请选择状态'
    },
    dataIndex: 'status'
  },
  {
    title: '上次调度时间',
    searchConfig: {
      name: 'createTime',
      valueType: 'dateRange',
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      rangeStartName: 'startTime',
      rangeEndName: 'endTime',
      placeholder: [ '请选择日期', '请选择日期' ]
    },
    dataIndex: 'createTime',
    sorter: true
  },
  {
    title: '操作',
    width: 180,
    dataIndex: 'action'
  }
]
