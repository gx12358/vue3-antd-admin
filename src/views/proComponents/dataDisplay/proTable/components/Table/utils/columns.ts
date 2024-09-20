import type { ProColumnsType } from '@gx-design-vue/pro-table'

export default {
  index: [
    {
      dataIndex: 'name',
      ellipsis: true,
      key: 'name',
      width: 150,
      searchConfig: {
        name: 'name',
        valueType: 'text',
        placeholder: '请输入'
      },
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
        placeholder: ['请选择', '请选择'],
        showTime: false,
        valueFormat: 'YYYY-MM-DD',
      }
    },
    { title: '作者', dataIndex: 'author', key: 'author' },
    { title: '简介', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '展示数量', dataIndex: 'pageViews', key: 'pageViews' },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '百分比', dataIndex: 'percent', key: 'percent', width: 150 },
    {
      title: 'Action',
      ellipsis: true,
      width: 150,
      copyable: true,
      dataIndex: 'action',
      key: 'action',
    }
  ],
  operationModal: [
    {
      dataIndex: 'name',
      ellipsis: true,
      key: 'name',
      width: 150,
      searchConfig: {
        name: 'name',
        valueType: 'text',
        placeholder: '请输入'
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      searchConfig: {
        name: 'createTime',
        valueType: 'dateRange',
        placeholder: ['请选择', '请选择'],
        showTime: false,
        valueFormat: 'YYYY-MM-DD',
      }
    },
    { title: '作者', dataIndex: 'author', key: 'author' },
    { title: '简介', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Action',
      width: 150,
      dataIndex: 'action',
      key: 'action',
    }
  ],
} as Record<string, ProColumnsType>
