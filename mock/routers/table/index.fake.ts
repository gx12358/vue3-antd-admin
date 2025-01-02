import type { ListSearchParams } from '@gx-mock/utils/table'
import { faker, fakerZH_CN } from '@faker-js/faker'
import { createMockRoute } from '@gx-mock'
import { handlePageList, initContent } from '@gx-mock/utils/table'
import { getMockRandowList, handleRandomImage, mockNumber } from '@gx-mock/utils/util'

export interface TableRecord {
  id: number;
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
  title: faker.book.title(),
  description: faker.lorem.paragraphs(),
  status: getMockRandowList<TableRecord['status']>([ 'published', 'draft', 'deleted' ]),
  author: fakerZH_CN.person.fullName(),
  pageViews: mockNumber(500, 1000),
  img: handleRandomImage(228, 228),
  switch: faker.datatype.boolean(),
  percent: mockNumber(80, 99),
  rate: getMockRandowList<number>([ 1, 2, 3, 4, 5 ]),
  name: `${fakerZH_CN.person.fullName()} ${i}`,
  age: mockNumber(20, 50),
  address: fakerZH_CN.location.city()
}))

export default createMockRoute({
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
