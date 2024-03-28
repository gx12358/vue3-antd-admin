import dayjs from 'dayjs'
import mockjs from 'mockjs'
import { groupList } from '@gx-mock/config/group'
import type { GroupListItem } from '@gx-mock/datasSource/group'
import type { ListItemDataType } from '@gx-mock/datasSource/list'
import { getArraryList, getMockRequest } from '@gx-mock/util/utils'
import type { ListItem, ListSearchParams } from '@gx-mock/util/table'
import { compareToMaxTime, handlePageList, initContent } from '@gx-mock/util/table'
import { fakeList } from '@gx-mock/config/article'

const { Random } = mockjs

export interface ProjectHomeCount {
  projectNum: number;
  viewsProjectNum: number;
  ranking: {
    current: number;
    max: number;
  };
}

export type ProjectListItem = ListItem & {
  name: string;
  createTime: string;
  description: string;
  group: GroupListItem;
}

interface ExtraAccountListRecorrd { tags: string }

export type AccountListRecord = ListItemDataType<ExtraAccountListRecorrd>

const pagelist = initContent<ProjectListItem>(100, () => ({
  name: Random.cname(),
  description: Random.cword(30, 50),
  createTime: dayjs().subtract(Random.integer(1, 10), 'day').format('YYYY-MM-DD HH:mm:ss'),
  group: groupList[Random.integer(0, groupList.length - 1)]
}))

const articlesData: AccountListRecord[] = fakeList<ExtraAccountListRecorrd>(
  50,
  () => ({ tags: getArraryList<string>(3, _ => Random.cword(2, 4)).join() })
)
const projectsData: AccountListRecord[] = fakeList<ExtraAccountListRecorrd>(
  60,
  () => ({ tags: getArraryList<string>(3, _ => Random.cword(2, 4)).join() })
)
const applicationsData: AccountListRecord[] = fakeList<ExtraAccountListRecorrd>(
  40,
  () => ({ tags: getArraryList<string>(3, _ => Random.cword(2, 4)).join() })
)

export default [
  getMockRequest({
    url: '/project/num',
    method: 'get',
    timeout: 200,
    callback: (_res) => {
      return {
        projectNum: Random.integer(10, 200),
        ranking: {
          current: Random.integer(1, 20),
          max: 24
        },
        viewsProjectNum: Random.integer(1000, 2000)
      }
    }
  }),
  getMockRequest({
    url: '/project/list',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      const { pageNum = 1, pageSize = 10, sord = 'asc', sidx = 'createTime' }: ListSearchParams = body

      return {
        list: handlePageList(pagelist, { pageNum, pageSize })
          .sort((a, b) =>
            compareToMaxTime(a, b, sidx, sord === 'asc' ? 0 : 1)),
        totalCount: pagelist.length
      }
    }
  }),
  getMockRequest({
    url: '/project/articles/list',
    method: 'post',
    timeout: 500,
    callback: ({ body }) => {
      const { pageNum = 1, pageSize = 10 }: ListSearchParams = body

      return {
        list: handlePageList(articlesData, { pageNum, pageSize }),
        totalCount: articlesData.length
      }
    }
  }),
  getMockRequest({
    url: '/project/projects/list',
    method: 'post',
    timeout: 500,
    callback: ({ body }) => {
      const { pageNum = 1, pageSize = 10 }: ListSearchParams = body

      return {
        list: handlePageList(projectsData, { pageNum, pageSize }),
        totalCount: projectsData.length
      }
    }
  }),
  getMockRequest({
    url: '/project/applications/list',
    method: 'post',
    timeout: 500,
    callback: ({ body }) => {
      const { pageNum = 1, pageSize = 10 }: ListSearchParams = body

      return {
        list: handlePageList(applicationsData, { pageNum, pageSize }),
        totalCount: applicationsData.length
      }
    }
  })
]
