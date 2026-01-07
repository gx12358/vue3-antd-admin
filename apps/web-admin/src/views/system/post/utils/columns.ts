import type { SystemPostApi } from '@/services/system/post'

export const columns: ProColumnsType<SystemPostApi.PostTableRecord, SystemPostApi.SearchConfig> = [
  {
    title: '岗位编号',
    width: 90,
    dataIndex: 'id'
  },
  {
    title: '岗位名称',
    dataIndex: 'name',
    searchConfig: {
      name: 'name',
      order: 1,
      valueType: 'text',
      placeholder: '请输入岗位名称'
    }
  },
  {
    title: '岗位编码',
    dataIndex: 'code',
    searchConfig: {
      name: 'code',
      order: 2,
      valueType: 'text',
      placeholder: '请输入岗位编码'
    }
  },
  {
    title: '显示顺序',
    width: 90,
    dataIndex: 'sort'
  },
  {
    title: '岗位备注',
    dataIndex: 'remark'
  },
  {
    title: '状态',
    width: 90,
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    width: 180,
    valueType: 'dateTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    width: 120,
    dataIndex: 'action'
  }
]
