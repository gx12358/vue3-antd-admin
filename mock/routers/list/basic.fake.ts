import type { ListItem, ListSearchParams } from '../../utils/table'
import { faker, fakerZH_CN } from '@faker-js/faker'
import dayjs from 'dayjs'
import { createMockRoute } from '../../../mock'
import { otherAccountList } from '../../config/user'
import { handlePageList, initContent, postDataSource } from '../../utils/table'
import { handleRandomImage } from '../../utils/util'

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
  title: faker.book.title(),
  avatar: faker.image.avatar(),
  cover: handleRandomImage(100, 100),
  status: [ 'active', 'exception', 'normal' ][i % 3] as | 'normal' | 'exception' | 'active' | 'success',
  percent: Math.ceil(Math.random() * 50) + 50,
  logo: handleRandomImage(30, 30),
  href: 'https://ant.design',
  updatedTime: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime())
    .format('YYYY-MM-DD HH:mm:ss'),
  createTime: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime())
    .format('YYYY-MM-DD HH:mm:ss'),
  subDescription: faker.lorem.paragraphs(2),
  description:
    '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
  activeUser: Math.ceil(Math.random() * 100000) + 100000,
  newUser: Math.ceil(Math.random() * 1000) + 1000,
  star: Math.ceil(Math.random() * 100) + 100,
  like: Math.ceil(Math.random() * 100) + 100,
  message: Math.ceil(Math.random() * 10) + 10,
  content: faker.lorem.paragraphs(2),
  members: [
    {
      name: fakerZH_CN.person.fullName(),
      avatar: faker.image.avatar(),
      id: 'member1'
    },
    {
      name: fakerZH_CN.person.fullName(),
      avatar: faker.image.avatar(),
      id: 'member2'
    },
    {
      name: fakerZH_CN.person.fullName(),
      avatar: faker.image.avatar(),
      id: 'member3'
    }
  ]
}))

export default createMockRoute([
  {
    url: '/basic/list/count',
    method: 'get',
    callback: () => {
      return {
        needDone: faker.number.int({ min: 10, max: 100 }),
        average: faker.number.int({ min: 10, max: 100 }),
        done: faker.number.int({ min: 10, max: 100 })
      } as BasicCountState
    }
  },
  {
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
  },
  {
    url: '/basic/list/details',
    method: 'get',
    timeout: 200,
    callback: ({ query }) => {
      return dataSource.find(el => el.id === query.id) || null
    }
  },
  {
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
  },
  {
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
  },
  {
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
  }
])
