import type { ListItem, ListSearchParams } from '../../utils/table'
import { faker, fakerZH_CN } from '@faker-js/faker'
import { createMockRoute } from '../../index'
import { handlePageList, initContent } from '../../utils/table'

export type TableRecord = {
  workId: string;
  name: string;
  department: string;
  isMock?: boolean;
  isUpdate?: boolean;
} & ListItem

let dataSource = initContent<TableRecord>(3, () => ({
  name: fakerZH_CN.person.fullName(),
  workId: `${faker.number.int({ min: 100, max: 200 })}`,
  department: faker.commerce.department()
}))

export default createMockRoute([
  {
    url: '/form/advancedForm',
    method: 'get',
    timeout: 200,
    callback: () => ({})
  },
  {
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
  },
  {
    url: '/form/advancedFormTable/add',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource.push(body as TableRecord)
      return null
    }
  },
  {
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
  },
  {
    url: '/form/advancedFormTable/delete',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource = dataSource.filter(item => item.id !== body.id)
      return null
    }
  }
])
