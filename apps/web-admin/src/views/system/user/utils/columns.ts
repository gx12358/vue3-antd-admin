import type { SystemUserApi } from '@/services/system/user'

export const columns: ProColumnsType<SystemUserApi.UserTableRecord, SystemUserApi.SearchConfig> = [
  {
    title: '用户编号',
    width: 80,
    dataIndex: 'id'
  },
  {
    title: '用户名称',
    dataIndex: 'username',
    searchConfig: {
      name: 'username',
      valueType: 'text',
      placeholder: '请输入用户名称'
    }
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname'
  },
  {
    title: '部门',
    width: 150,
    dataIndex: 'deptName'
  },
  {
    title: '手机号码',
    width: 120,
    dataIndex: 'mobile',
    searchConfig: {
      name: 'mobile',
      valueType: 'text',
      placeholder: '请输入手机号码'
    }
  },
  {
    title: '状态',
    width: 90,
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    width: 180,
    dataIndex: 'createTime',
    valueType: 'dateTime',
    searchConfig: {
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
