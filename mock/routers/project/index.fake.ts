import type { GroupListItem } from '@gx-mock/routers/group/index.fake'
import type { ListItemDataType } from '@gx-mock/routers/list/index.fake'
import type { ListItem, ListSearchParams } from '@gx-mock/utils/table'
import { faker, fakerZH_CN } from '@faker-js/faker'
import { createMockRoute } from '@gx-mock'
import { fakeList } from '@gx-mock/config/article'
import { groupList } from '@gx-mock/config/group'
import { compareToMaxTime, handlePageList, initContent } from '@gx-mock/utils/table'
import { getArraryList, mockNumber } from '@gx-mock/utils/util'
import dayjs from 'dayjs'

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

interface ExtraAccountListRecorrd {tags: string}

export type AccountListRecord = ListItemDataType<ExtraAccountListRecorrd>

const pagelist = initContent<ProjectListItem>(100, () => ({
  name: fakerZH_CN.person.fullName(),
  description: faker.lorem.paragraphs(),
  createTime: dayjs().subtract(mockNumber(1, 10), 'day').format('YYYY-MM-DD HH:mm:ss'),
  group: groupList[mockNumber(0, groupList.length - 1)]
}))

const articlesData: AccountListRecord[] = fakeList<ExtraAccountListRecorrd>(
  50,
  () => ({
    tags: getArraryList<string>(3, _ => faker.lorem.words({
      min: 2,
      max: 4
    })).join()
  })
)
const projectsData: AccountListRecord[] = fakeList<ExtraAccountListRecorrd>(
  60,
  () => ({
    tags: getArraryList<string>(3, _ => faker.lorem.words({
      min: 2,
      max: 4
    })).join()
  })
)
const applicationsData: AccountListRecord[] = fakeList<ExtraAccountListRecorrd>(
  40,
  () => ({
    tags: getArraryList<string>(3, _ => faker.lorem.words({
      min: 2,
      max: 4
    })).join()
  })
)

export default createMockRoute([
  {
    url: '/project/num',
    method: 'get',
    timeout: 200,
    callback: (_res) => {
      return {
        projectNum: mockNumber(10, 200),
        ranking: {
          current: mockNumber(1, 20),
          max: 24
        },
        viewsProjectNum: mockNumber(1000, 2000)
      }
    }
  },
  {
    url: '/project/list',
    method: 'post',
    timeout: 200,
    callback: ({ body }) => {
      const {
        pageNum = 1,
        pageSize = 10,
        sord = 'asc',
        sidx = 'createTime'
      }: ListSearchParams = body

      return {
        list: handlePageList(pagelist, { pageNum, pageSize })
          .sort((a, b) =>
            compareToMaxTime(a, b, sidx, sord === 'asc' ? 0 : 1)),
        totalCount: pagelist.length
      }
    }
  },
  {
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
  },
  {
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
  },
  {
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
  }
])
