import type { SystemRoleApi } from '@/services/system/role'

export const columns: ProColumnsType<SystemRoleApi.RoleTableRecord, SystemRoleApi.SearchConfig> = [
  {
    title: '角色编号',
    width: 90,
    dataIndex: 'id'
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    searchConfig: {
      name: 'name',
      order: 1,
      valueType: 'text',
      placeholder: '请输入角色名称'
    }
  },
  {
    dataIndex: 'type',
    title: '角色类型',
    minWidth: 100,
  },
  {
    title: '角色标识',
    dataIndex: 'code',
    searchConfig: {
      name: 'code',
      order: 2,
      valueType: 'text',
      placeholder: '请输入角色标识'
    }
  },
  {
    title: '显示顺序',
    width: 90,
    dataIndex: 'sort'
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
    searchConfig: {
      order: 4,
      name: 'createTime',
      valueType: 'dateRange',
      valueFormat: 'YYYY-MM-DD'
    }
  },
  {
    title: '操作',
    width: 180,
    dataIndex: 'action'
  }
]
