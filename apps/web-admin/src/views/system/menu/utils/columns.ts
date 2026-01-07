export const columns: ProColumnsType<SystemMenuItem, any> = [
  {
    title: '菜单名称',
    dataIndex: 'name',
  },
  {
    title: '菜单类型',
    dataIndex: 'type'
  },
  {
    title: '显示排序',
    dataIndex: 'sort'
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    columnEmptyText: '-'
  },
  {
    title: '组件路径',
    dataIndex: 'path'
  },
  {
    title: '组件名称',
    dataIndex: 'componentName'
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    width: 220,
    dataIndex: 'action'
  }
]
