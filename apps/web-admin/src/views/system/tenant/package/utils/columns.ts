import type { SystemTenantPackageApi } from '@/services/system/tenant-package'

export const columns: ProColumnsType<SystemTenantPackageApi.TenantPackageTable, SystemTenantPackageApi.SearchConfig> = [
  {
    title: '套餐编号',
    width: 90,
    dataIndex: 'id'
  },
  {
    title: '套餐名称',
    dataIndex: 'name',
    searchConfig: {
      order: 1,
      name: 'name',
      valueType: 'text',
      placeholder: '请输入套餐名称'
    }
  },
  {
    title: '状态',
    width: 90,
    dataIndex: 'status'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '创建时间',
    width: 180,
    valueType: 'dateTime',
    dataIndex: 'createTime',
    searchConfig: {
      order: 5,
      name: 'createTime',
      valueType: 'dateRange',
      valueFormat: 'YYYY-MM-DD'
    }
  },
  {
    title: '操作',
    width: 120,
    dataIndex: 'action'
  }
]
