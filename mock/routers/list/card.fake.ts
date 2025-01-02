import type { ListItem, ListSearchParams } from '../../utils/table'
import { faker } from '@faker-js/faker'
import { createMockRoute } from '../../../mock'
import { handlePageList, initContent, postDataSource } from '../../utils/table'

export type CardSearchParmas = {
  title: string;
} & ListSearchParams

export type CardListItemDataType = {
  title: string;
  avatar: string;
  description: string;
} & ListItem

let dataSource = initContent<CardListItemDataType>(100, () => ({
  title: faker.book.title(),
  avatar: faker.image.avatar(),
  description: faker.lorem.paragraphs(2)
}))

export default createMockRoute([
  {
    url: '/card/list',
    method: 'get',
    timeout: 200,
    callback: ({ query }) => {
      const { pageNum = 1, pageSize = 10, title } = query

      return {
        list: handlePageList(dataSource, {
          pageNum,
          pageSize,
          callBack: (data) => {
            if (title) {
              data = data.filter(data => data.title.includes(title || ''))
            }

            return data
          }
        }),
        totalCount: dataSource.length
      } as PageResult<CardListItemDataType>
    }
  },
  {
    url: '/card/list/details',
    method: 'get',
    timeout: 200,
    callback: ({ query }) => {
      return dataSource.find(el => el.id === query.id) || null
    }
  },
  {
    url: '/card/list/add',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource = postDataSource<CardListItemDataType>(
        dataSource,
        'add',
        { key: 'id', params: body }
      )

      return null
    }
  },
  {
    url: '/card/list/update',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource = postDataSource<CardListItemDataType>(
        dataSource,
        'update',
        { key: 'id', params: body }
      )

      return null
    }
  },
  {
    url: '/card/list/delete',
    method: 'delete',
    timeout: 200,
    callback: ({ query }) => {
      dataSource = postDataSource<CardListItemDataType>(
        dataSource,
        'delete',
        { key: 'id', params: query }
      )

      return null
    }
  }
])
