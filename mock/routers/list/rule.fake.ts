import type { ListItem, ListSearchParams } from '@gx-mock/utils/table'
import { createMockRoute } from '@gx-mock'
import { initContent } from '@gx-mock/utils/table'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

export type RulesListItem = {
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updateTime: string;
  progress: number;
} & ListItem

export type RulesListSearchParams = ListSearchParams & {
  sortOrder?: string;
  sortField?: string;
  name?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  desc?: string;
}

const momentFiled = [ 'updateTime', 'createTime' ]

let dataSource = initContent<RulesListItem>(100, key => ({
  disabled: key % 6 === 0,
  href: 'https://ant.design',
  avatar: [
    'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
    'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'
  ][key % 2],
  name: `TradeCode ${key}`,
  owner: '曲丽丽',
  desc: '这是一段描述',
  callNo: Math.floor(Math.random() * 1000),
  status: (Math.floor(Math.random() * 10) % 4).toString(),
  updateTime: dayjs().subtract(Math.random() * 100, 'day').format('YYYY-MM-DD HH:mm:ss'),
  createTime: dayjs().subtract(Math.random() * 100, 'day').format('YYYY-MM-DD HH:mm:ss'),
  progress: Math.ceil(Math.random() * 100)
})).reverse()

function getRule(params: RulesListSearchParams) {
  const { pageNum = 1, pageSize = 10, sortOrder = '', sortField = '' } = params
  let tableList = cloneDeep(dataSource)

  if (sortOrder) {
    tableList = tableList.sort((prev, next) => {
      let sortNumber = 0
      const prevValue = momentFiled.includes(sortField) ? dayjs(prev[sortField]) : prev[sortField]
      const nextValue = momentFiled.includes(sortField) ? dayjs(next[sortField]) : next[sortField]
      if (sortOrder === 'descend') {
        if (prevValue - nextValue > 0) {
          sortNumber += -1
        } else {
          sortNumber += 1
        }
      } else {
        if (prevValue - nextValue > 0) {
          sortNumber += 1
        } else {
          sortNumber += -1
        }
      }
      return sortNumber
    })
  }

  if (params.name) {
    tableList = tableList.filter(data => data.name.includes(params.name || ''))
  }

  if (params.desc) {
    tableList = tableList.filter(data => data.desc.includes(params.desc || ''))
  }

  if (params.status) {
    tableList = tableList.filter(data => data.status === params.status)
  }

  if (params.startTime && params.endTime) {
    // tableList = tableList.filter((data) => dayjs(data.createTime).isBetween(params.startTime, dayjs(params.endTime)))
  }

  return {
    list: cloneDeep(tableList).slice(
      ((pageNum as number) - 1) * (pageSize as number),
      (pageNum as number) * (pageSize as number)
    ),
    totalCount: tableList.length
  }
}

function postRule(body: Partial<RulesListItem>, type: 'delete' | 'add' | 'update') {
  const { name, desc, id, createTime } = body
  const i = Math.ceil(Math.random() * 10000)
  const newRule: Partial<RulesListItem> = {
    id: dataSource.length,
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'
    ][i % 2],
    owner: '曲丽丽',
    callNo: Math.floor(Math.random() * 1000),
    status: (Math.floor(Math.random() * 10) % 2).toString(),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    progress: Math.ceil(Math.random() * 100)
  }
  if (name) newRule.name = name
  if (desc) newRule.desc = desc
  switch (type) {
    case 'delete':
      dataSource = dataSource.filter(item => id !== item.id)
      break
    case 'add':
      dataSource.unshift(newRule as RulesListItem)
      break
    case 'update':
      dataSource = dataSource.map((item) => {
        if (item.id === id) {
          if (name) item.name = name
          if (desc) item.desc = desc
          if (createTime) item.createTime = createTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        return item
      })
      break
    default:
      break
  }
}

export default createMockRoute([
  {
    url: '/rule/list',
    method: 'post',
    timeout: 500,
    callback: ({ body }) => getRule(body)
  },
  {
    url: '/rule/add',
    method: 'post',
    callback: ({ body }) => {
      postRule(body, 'add')
      return null
    }
  },
  {
    url: '/rule/update',
    method: 'post',
    callback: ({ body }) => {
      postRule(body, 'update')
      return null
    }
  },
  {
    url: '/rule/delete',
    method: 'post',
    callback: ({ body }) => {
      postRule(body, 'delete')
      return null
    }
  }
])
