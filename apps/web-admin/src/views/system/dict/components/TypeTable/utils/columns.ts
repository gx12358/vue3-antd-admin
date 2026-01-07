import type { SystemDictTypeApi } from '@/services/system/dict'

export const columns: ProColumnsType<SystemDictTypeApi.DictTypeTableRecord, SystemDictTypeApi.SearchConfig> = [
  {
    title: '字典编号',
    width: 90,
    dataIndex: 'id'
  },
  {
    title: '字典名称',
    dataIndex: 'name',
    searchConfig: {
      name: 'name',
      order: 1,
      valueType: 'text',
      placeholder: '请输入字典名称'
    }
  },
  {
    dataIndex: 'type',
    title: '字典类型',
    minWidth: 100,
    searchConfig: {
      name: 'type',
      order: 1,
      valueType: 'text',
      placeholder: '请输入字典类型'
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
  },
  {
    title: '操作',
    width: 120,
    dataIndex: 'action'
  }
]
