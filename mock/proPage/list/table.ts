import { MockMethod } from 'vite-plugin-mock'
import dayjs from 'dayjs'
import { builder, getRequestToken, requestParams } from '../../_util'

const momentFiled = [ 'updatedAt', 'createdAt' ]

type TableListItem = {
  key: number | string;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: string;
  createdAt: string;
  progress: number;
  children?: TableListItem[]
};

type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  pageNum?: number;
  sortField?: string;
  sortOrder?: string;
};

// mock tableListDataSource
const genList = (pageNum: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = []

  for (let i = 0; i < pageSize; i += 1) {
    const index = (pageNum - 1) * 10 + i
    tableListDataSource.push({
      key: index,
      disabled: i % 6 === 0,
      href: 'https://ant.design',
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'
      ][i % 2],
      name: `TradeCode ${index}`,
      owner: '曲丽丽',
      desc: '这是一段描述',
      callNo: Math.floor(Math.random() * 1000),
      status: (Math.floor(Math.random() * 10) % 4).toString(),
      updatedAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      createdAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      progress: Math.ceil(Math.random() * 100)
    })
  }
  tableListDataSource.reverse()
  return tableListDataSource
}

let tableListDataSource: TableListItem[] = genList(1, 100)

function getRule(params: TableListParams) {

  const { pageNum = 1, pageSize = 10, sortOrder = '', sortField = '' } = params

  let dataSource = [ ...tableListDataSource ]
  if (sortOrder) {
    dataSource = dataSource.sort((prev, next) => {
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
  // if (filter) {
  //   const filter = body.filter as Record<string, string[]>
  //   if (Object.keys(filter).length > 0) {
  //     dataSource = dataSource.filter((item) => {
  //       return Object.keys(filter).some((key) => {
  //         if (!filter[key]) {
  //           return true
  //         }
  //         if (filter[key].includes(`${item[key]}`)) {
  //           return true
  //         }
  //         return false
  //       })
  //     })
  //   }
  // }

  if (params.name) {
    dataSource = dataSource.filter((data) => data.name.includes(params.name || ''))
  }

  if (params.status) {
    dataSource = dataSource.filter((data) => data.status === params.status)
  }

  dataSource = dataSource.slice(
    ((pageNum as number) - 1) * (pageSize as number),
    (pageNum as number) * (pageSize as number)
  )

  const result = {
    rows: dataSource,
    total: tableListDataSource.length,
    pageNum: parseInt(`${params.pageNum}`, 10) || 1
  }

  return result
}

function postRule(body, type) {
  const { name, desc, key } = body
  switch (type) {
    case 'delete':
      tableListDataSource = tableListDataSource.filter((item) => key !== item.key)
      break
    case 'add':
      const i = Math.ceil(Math.random() * 10000)
      const newRule = {
        key: tableListDataSource.length,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'
        ][i % 2],
        name,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: (Math.floor(Math.random() * 10) % 2).toString(),
        updatedAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        createdAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        progress: Math.ceil(Math.random() * 100)
      }
      tableListDataSource.unshift(newRule)
      break
    case 'update':
      tableListDataSource = tableListDataSource.map((item) => {
        if (item.key === key) {
          return { ...item, desc, name }
        }
        return item
      })
      break
    default:
      break
  }
}

export default [
  {
    url: '/mock-server/rule_list',
    timeout: 500,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, { ...getRule(request.body) })
    }
  },
  {
    url: '/mock-server/rule_info',
    timeout: 200,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      const { key } =request.body
      return builder(token, {
        data: tableListDataSource.find(item => item.key === key),
        code: tableListDataSource.some(item => item.key === key) ? 200 : 500,
        msg: '请传入正确的key值！'
      })
    }
  },
  {
    url: '/mock-server/rule',
    timeout: 200,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      postRule(request.body, 'add')
      return builder(token)
    }
  },
  {
    url: '/mock-server/rule',
    timeout: 200,
    method: 'put',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      postRule(request.body, 'update')
      return builder(token)
    }
  },
  {
    url: '/mock-server/rule',
    timeout: 200,
    method: 'delete',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      postRule(request.body, 'delete')
      return builder(token)
    }
  }
] as MockMethod[]
