import type { ProColumnsType } from '@gx-design-vue/pro-table'

export const goodsColumns: ProColumnsType = [
  {
    title: '数量（件）',
    dataIndex: 'num',
    key: 'num',
    align: 'right' as 'left' | 'right' | 'center'
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right' as 'left' | 'right' | 'center'
  }
]

export const scheduleColumns: ProColumnsType = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time'
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },

  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator'
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost'
  }
]
