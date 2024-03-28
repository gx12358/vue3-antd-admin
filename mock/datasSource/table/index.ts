import mockjs from 'mockjs'
import { getMockRandowList, getMockRequest, handleRandomImage } from '@gx-mock/util/utils'
import type { ListSearchParams } from '@gx-mock/util/table'
import { handlePageList, initContent } from '@gx-mock/util/table'

const { Random } = mockjs

export interface TableRecord {
  name: string;
  title: string;
  author: string;
  age: number;
  address: string;
  pageViews: number;
  img: string;
  description: string;
  percent: number;
  switch: boolean;
  rate: number;
  status: 'published' | 'draft' | 'deleted';
}

const dataSource = initContent<TableRecord>(120, i => ({
  title: Random.ctitle(10, 20),
  description: Random.cword(30, 50),
  status: getMockRandowList<TableRecord['status']>([ 'published', 'draft', 'deleted' ]),
  author: Random.cname(),
  pageViews: Random.integer(500, 1000),
  img: handleRandomImage(228, 228),
  switch: Random.boolean(),
  percent: Random.integer(80, 99),
  rate: getMockRandowList<number>([ 1, 2, 3, 4, 5 ]),
  name: `${Random.cname()} ${i}`,
  age: Random.integer(20, 50),
  address: `${Random.province()}`
}))

export default [
  getMockRequest({
    url: '/table/list',
    method: 'post',
    timeout: 500,
    callback: ({ body }) => {
      const { pageNum = 1, pageSize = 10 }: ListSearchParams = body

      return {
        list: handlePageList(dataSource, { pageNum, pageSize }),
        totalCount: dataSource.length
      }
    }
  })
]
