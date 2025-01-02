import { faker, fakerZH_CN } from '@faker-js/faker'
import { createMockRoute } from '@gx-mock'
import { otherAccountList } from '@gx-mock/config/user'
import { handlePageList, initContent } from '@gx-mock/utils/table'
import { mockNumber } from '@gx-mock/utils/util'
import dayjs from 'dayjs'

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
  type: faker.book.title(),
  name: fakerZH_CN.person.fullName(),
  status: [ 'active', 'agree', 'reject' ][i % 3] as any,
  updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  memo: faker.word.words()
}))

const advancedTableTwo = initContent<AdvancedTableRecord>(100, i => ({
  type: faker.book.title(),
  name: fakerZH_CN.person.fullName(),
  status: [ 'active', 'agree', 'reject' ][i % 3] as any,
  updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  memo: faker.word.words()
}))

const advancedTableThree = initContent<AdvancedTableRecord>(100, i => ({
  type: faker.book.title(),
  name: fakerZH_CN.person.fullName(),
  status: [ 'active', 'agree', 'reject' ][i % 3] as any,
  updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  memo: faker.word.words()
}))

export default createMockRoute([
  {
    url: '/profile/advanced',
    method: 'get',
    callback: () => ({
      createId: otherAccountList[mockNumber(0, otherAccountList.length - 1)]?.id,
      createName: otherAccountList[mockNumber(0, otherAccountList.length - 1)]?.name,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      effectTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      number: mockNumber(100000, 1000000),
      count: mockNumber(100, 1000),
      status: [ 'wait', 'success' ][mockNumber(0, 1)] as any
    })
  },
  {
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
  },
  {
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
  },
  {
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
  }
])
