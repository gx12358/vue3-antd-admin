import type { MockTableRecord, SearchConfig } from '@/services/demo/table'

export const columns: ProColumnsType<TableRecord<MockTableRecord>, SearchConfig> = [
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
    key: 'title',
    width: 150,
    searchConfig: {
      name: 'title',
      valueType: 'text',
      placeholder: '请输入标题'
    }
  },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 100, resizable: false },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: 150,
    searchConfig: {
      name: 'createTime',
      valueType: 'dateRange',
      placeholder: [ '请选择', '请选择' ],
      showTime: false,
      valueFormat: 'YYYY-MM-DD'
    }
  },
  { title: '作者', dataIndex: 'author', key: 'author' },
  { title: '简介', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '百分比', dataIndex: 'percent', key: 'percent', width: 220 },
  {
    title: 'Action',
    ellipsis: true,
    width: 150,
    copyable: true,
    dataIndex: 'action',
    key: 'action'
  }
]

export const operationModal: ProColumnsType<TableRecord<MockTableRecord>, SearchConfig> = [
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
    key: 'title',
    searchConfig: {
      order: 1,
      name: 'title',
      valueType: 'text',
      placeholder: '请输入标题'
    }
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  { title: '作者', dataIndex: 'author', key: 'author' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  {
    title: 'Action',
    width: 100,
    dataIndex: 'action',
    key: 'action'
  }
]
