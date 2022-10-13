export default {
  index: [
    {
      dataIndex: 'name',
      searchConfig: {
        name: 'name',
        valueType: 'text',
        placeholder: '请输入规则名称'
      },
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
      searchConfig: {
        name: 'callNo',
        valueType: 'text',
        placeholder: '请输入服务调用次数'
      },
      dataIndex: 'callNo',
      sorter: true,
    },
    {
      title: '状态',
      searchConfig: {
        name: 'status',
        valueType: 'select',
        valueEnum: [
          {
            text: '关闭',
            value: '0',
          },
          {
            text: '运行中',
            value: '1',
          },
          {
            text: '已上线',
            value: '2',
          },
          {
            text: '异常',
            value: '3',
          }
        ],
        placeholder: '请选择状态'
      },
      dataIndex: 'status',
    },
    {
      title: '上次调度时间',
      searchConfig: {
        name: 'updatedAt',
        valueType: 'date',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择上次调度时间'
      },
      dataIndex: 'updatedAt',
      sorter: true
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'action',
    }
  ]
}
