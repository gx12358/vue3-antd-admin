import type { SystemTenantApi } from '@/services/system/tenant'

export const columns: ProColumnsType<SystemTenantApi.TenantTableRecord, SystemTenantApi.SearchConfig> = [
  {
    title: '租户编号',
    width: 90,
    dataIndex: 'id'
  },
  {
    title: '租户名',
    dataIndex: 'name',
    searchConfig: {
      order: 1,
      name: 'name',
      valueType: 'text',
      placeholder: '请输入租户名'
    }
  },
  {
    dataIndex: 'packageId',
    title: '租户套餐',
    minWidth: 100,
  },
  {
    title: '联系人',
    dataIndex: 'contactName',
    searchConfig: {
      order: 2,
      name: 'contactName',
      valueType: 'text',
      placeholder: '请输入联系人'
    }
  },
  {
    title: '联系手机',
    dataIndex: 'contactMobile',
    searchConfig: {
      order: 3,
      name: 'contactMobile',
      valueType: 'text',
      placeholder: '请输入联系手机'
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
