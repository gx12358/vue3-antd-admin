import mockjs from 'mockjs'
import { getMockRequest } from '@gx-mock/util/utils'
import type { ListItem, ListSearchParams } from '@gx-mock/util/table'
import { handlePageList, initContent } from '@gx-mock/util/table'

const { Random } = mockjs

export type TableRecord = {
  workId: string;
  name: string;
  department: string;
  isMock?: boolean;
  isUpdate?: boolean;
} & ListItem

let dataSource = initContent<TableRecord>(3, () => ({
  name: Random.cname(),
  workId: `${Random.integer(100, 200)}`,
  department: Random.ctitle(3, 5),
}))

export default [
  getMockRequest({
    url: '/form/advancedForm',
    method: 'get',
    timeout: 200,
    callback: () => ({})
  }),
  getMockRequest({
    url: '/form/advancedFormTable',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      const { pageNum = 1, pageSize = 10 }: ListSearchParams = body

      return {
        list: handlePageList(dataSource, { pageNum, pageSize }),
        totalCount: dataSource.length
      }
    }
  }),
  getMockRequest({
    url: '/form/advancedFormTable/add',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource.push(body as TableRecord)
      return null
    }
  }),
  getMockRequest({
    url: '/form/advancedFormTable/update',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource = dataSource.map((item) => {
        if (item.id === body.id)
          return { ...item, ...body }
        return item
      })
      return null
    }
  }),
  getMockRequest({
    url: '/form/advancedFormTable/delete',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource = dataSource.filter(item => item.id !== body.id)
      return null
    }
  }),
]
