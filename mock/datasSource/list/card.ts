import mockjs from 'mockjs'
import { getMockRequest, handleRandomImage } from '@gx-mock/util/utils'
import type { ListItem, ListSearchParams } from '@gx-mock/util/table'
import { handlePageList, initContent, postDataSource } from '@gx-mock/util/table'

const { Random } = mockjs

export type CardSearchParmas = {
  title: string;
} & ListSearchParams

export type CardListItemDataType = {
  title: string;
  avatar: string;
  description: string;
} & ListItem

let dataSource = initContent<CardListItemDataType>(100, () => ({
  title: Random.ctitle(10, 20),
  avatar: handleRandomImage(200, 200),
  description: Random.cparagraph(2, 3)
}))

export default [
  getMockRequest<CardSearchParmas>({
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
  }),
  getMockRequest({
    url: '/card/list/details',
    method: 'get',
    timeout: 200,
    callback: ({ query }) => {
      return dataSource.find(el => el.id === query.id)
    }
  }),
  getMockRequest<Partial<CardListItemDataType>>({
    url: '/card/list/add',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource = postDataSource<CardListItemDataType>(dataSource, 'add', { key: 'id', params: body })

      return null
    }
  }),
  getMockRequest<Partial<CardListItemDataType>>({
    url: '/card/list/update',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource = postDataSource<CardListItemDataType>(dataSource, 'update', { key: 'id', params: body })

      return null
    }
  }),
  getMockRequest<Partial<CardListItemDataType>>({
    url: '/card/list/delete',
    method: 'delete',
    timeout: 200,
    callback: ({ query }) => {
      dataSource = postDataSource<CardListItemDataType>(dataSource, 'delete', { key: 'id', params: query })

      return null
    }
  }),
]
