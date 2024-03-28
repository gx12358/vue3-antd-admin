import mockjs from 'mockjs'
import dayjs from 'dayjs'
import { getMockRequest, handleRandomImage } from '@gx-mock/util/utils'
import { otherAccountList } from '@gx-mock/config/user'
import type { ListItem, ListSearchParams } from '@gx-mock/util/table'
import { handlePageList, initContent, postDataSource } from '@gx-mock/util/table'

const { Random } = mockjs

export interface BasicCountState {
  needDone: number;
  average: number;
  done: number;
}

export type BasicSearchParmas = {
  status: 'all' | 'normal' | 'active';
  title: string;
} & ListSearchParams

interface Member {
  avatar: string;
  name: string;
  id: string;
}

export type BasicListItemDataType = {
  owner: string;
  ownerId: number;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedTime: string;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
} & ListItem

let dataSource = initContent<BasicListItemDataType>(100, i => ({
  owner: otherAccountList[i % otherAccountList.length]?.name,
  ownerId: otherAccountList[i % otherAccountList.length]?.id,
  title: Random.ctitle(10, 20),
  avatar: handleRandomImage(30, 30),
  cover: handleRandomImage(100, 100),
  status: [ 'active', 'exception', 'normal' ][i % 3] as | 'normal' | 'exception' | 'active' | 'success',
  percent: Math.ceil(Math.random() * 50) + 50,
  logo: handleRandomImage(30, 30),
  href: 'https://ant.design',
  updatedTime: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime())
    .format('YYYY-MM-DD HH:mm:ss'),
  createTime: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime())
    .format('YYYY-MM-DD HH:mm:ss'),
  subDescription: Random.cparagraph(2, 4),
  description:
    '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
  activeUser: Math.ceil(Math.random() * 100000) + 100000,
  newUser: Math.ceil(Math.random() * 1000) + 1000,
  star: Math.ceil(Math.random() * 100) + 100,
  like: Math.ceil(Math.random() * 100) + 100,
  message: Math.ceil(Math.random() * 10) + 10,
  content:
    '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
  members: [
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
      name: '曲丽丽',
      id: 'member1'
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
      name: '王昭君',
      id: 'member2'
    },
    {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
      name: '董娜娜',
      id: 'member3'
    }
  ]
}))

export default [
  getMockRequest({
    url: '/basic/list/count',
    method: 'get',
    callback: () => {
      return {
        needDone: Random.integer(10, 100),
        average: Random.integer(10, 100),
        done: Random.integer(10, 100)
      } as BasicCountState
    }
  }),
  getMockRequest({
    url: '/basic/list',
    method: 'get',
    timeout: 200,
    callback: ({ query }) => {
      const { pageNum = 1, pageSize = 10, title, status }: BasicSearchParmas = query as any

      return {
        list: handlePageList(dataSource, {
          pageNum,
          pageSize,
          callBack: (data) => {
            if (title) {
              data = data.filter(data => data.title.includes(title || ''))
            }

            if (status) {
              if (status !== 'all')
                data = data.filter(data => data.status === status)
            }

            return data
          }
        }),
        totalCount: dataSource.length
      } as PageResult<BasicListItemDataType>
    }
  }),
  getMockRequest({
    url: '/basic/list/details',
    method: 'get',
    timeout: 200,
    callback: ({ query }) => {
      return dataSource.find(el => el.id === query.id)
    }
  }),
  getMockRequest<Partial<BasicListItemDataType>>({
    url: '/basic/list/add',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource = postDataSource<BasicListItemDataType>(
        dataSource,
        'add',
        { key: 'id', params: body }
      )

      return null
    }
  }),
  getMockRequest<Partial<BasicListItemDataType>>({
    url: '/basic/list/update',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      dataSource = postDataSource<BasicListItemDataType>(
        dataSource,
        'update',
        { key: 'id', params: body }
      )

      return null
    }
  }),
  getMockRequest<Partial<BasicListItemDataType>>({
    url: '/basic/list/delete',
    method: 'delete',
    timeout: 200,
    callback: ({ query }) => {
      dataSource = postDataSource<BasicListItemDataType>(
        dataSource,
        'delete',
        { key: 'id', params: query }
      )

      return null
    }
  })
]
