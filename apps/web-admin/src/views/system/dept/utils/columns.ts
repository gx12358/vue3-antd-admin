import type { SystemDeptApi } from '@/services/system/dept'

export const columns: ProColumnsType<SystemDeptApi.Dept, any> = [
  {
    title: '部门名称',
    dataIndex: 'name',
  },
  {
    title: '负责人',
    dataIndex: 'leaderUserId'
  },
  {
    title: '显示顺序',
    dataIndex: 'sort'
  },
  {
    title: '部门状态',
    dataIndex: 'status',
  },
  {
    title: '创建时间',
    valueType: 'dateTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    width: 220,
    dataIndex: 'action'
  }
]
