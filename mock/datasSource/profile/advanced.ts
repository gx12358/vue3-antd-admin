import dayjs from 'dayjs'
import mockjs from 'mockjs'
import { getMockRequest } from '@gx-mock/util/utils'
import type { ListSearchParams } from '@gx-mock/util/table'
import { handlePageList, initContent } from '@gx-mock/util/table'
import { otherAccountList } from '@gx-mock/config/user'

const { Random } = mockjs

export interface AdvancedDetails {
  createId: number;
  createName: string;
  createTime: string;
  effectTime: string;
  count: number;
  number: number;
  status: 'wait' | 'success';
}

export interface AdvancedTableRecord {
  type: string;
  name: string;
  status: 'agree' | 'reject' | 'active';
  updateTime: string;
  memo: string;
}

const advancedTableOne = initContent<AdvancedTableRecord>(100, i => ({
  type: Random.ctitle(10, 15),
  name: Random.cname(),
  status: [ 'active', 'agree', 'reject' ][i % 3] as any,
  updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  memo: Random.cword(10, 20)
}))

const advancedTableTwo = initContent<AdvancedTableRecord>(100, i => ({
  type: Random.ctitle(10, 15),
  name: Random.cname(),
  status: [ 'active', 'agree', 'reject' ][i % 3] as any,
  updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  memo: Random.cword(10, 20)
}))

const advancedTableThree = initContent<AdvancedTableRecord>(100, i => ({
  type: Random.ctitle(10, 15),
  name: Random.cname(),
  status: [ 'active', 'agree', 'reject' ][i % 3] as any,
  updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  memo: Random.cword(10, 20)
}))

export default [
  getMockRequest<any, AdvancedDetails>({
    url: '/profile/advanced',
    method: 'get',
    callback: () => ({
      createId: otherAccountList[Random.integer(0, otherAccountList.length - 1)]?.id,
      createName: otherAccountList[Random.integer(0, otherAccountList.length - 1)]?.name,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      effectTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      number: Random.integer(100000, 1000000),
      count: Random.integer(100, 1000),
      status: [ 'wait', 'success' ][Random.integer(0, 1)] as any
    })
  }),
  getMockRequest<ListSearchParams, PageResult<AdvancedTableRecord>>({
    url: '/profile/advanced/table1',
    method: 'get',
    timeout: 200,
    callback: ({ query }) => ({
      list: handlePageList<AdvancedTableRecord>(advancedTableOne, {
        pageNum: query.pageNum,
        pageSize: query.pageSize
      }),
      totalCount: advancedTableOne.length
    })
  }),
  getMockRequest<ListSearchParams, PageResult<AdvancedTableRecord>>({
    url: '/profile/advanced/table2',
    method: 'get',
    timeout: 200,
    callback: ({ query }) => ({
      list: handlePageList<AdvancedTableRecord>(advancedTableTwo, {
        pageNum: query.pageNum,
        pageSize: query.pageSize
      }),
      totalCount: advancedTableTwo.length
    })
  }),
  getMockRequest<ListSearchParams, PageResult<AdvancedTableRecord>>({
    url: '/profile/advanced/table3',
    method: 'get',
    timeout: 200,
    callback: ({ query }) => ({
      list: handlePageList<AdvancedTableRecord>(advancedTableThree, {
        pageNum: query.pageNum,
        pageSize: query.pageSize
      }),
      totalCount: advancedTableThree.length
    })
  }),
]
