import type { ListSearchParams } from '../../utils/table'
import { fakeList } from '../../config/article'
import { createMockRoute } from '../../index'
import { handlePageList } from '../../utils/table'

const dataSource = fakeList(50)

export default createMockRoute({
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
