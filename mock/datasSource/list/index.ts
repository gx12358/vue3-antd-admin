import { getMockRequest } from '@gx-mock/util/utils'
import type { ListSearchParams } from '@gx-mock/util/table'
import { handlePageList } from '@gx-mock/util/table'
import { fakeList } from '@gx-mock/config/article'

export interface Member {
  avatar: string;
  name: string;
  id: string;
}

interface DefaultListItemDataType {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
}

export type ListItemDataType<T = undefined> = T extends undefined ? DefaultListItemDataType : DefaultListItemDataType & T

const dataSource = fakeList(50)

export default [
  getMockRequest({
    url: '/article/list',
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
