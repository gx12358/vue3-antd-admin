import type { BasicGood, BasicProgress } from '../typings'

export const goodsColumns: ProColumnsType<BasicGood> = [
  {
    title: '数量（件）',
    dataIndex: 'num',
    key: 'num',
    align: 'right'
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right'
  }
]

export const progressColumns: ProColumnsType<BasicProgress> = [
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
