import { createMockRoute } from '@gx-mock'
import { authorList, categoryList, commonStatus } from '@gx-mock/config/dict'
import { cloneDeep } from 'lodash-es'

export default createMockRoute([
  {
    url: '/dict/data/type/sys_common_status',
    method: 'get',
    callback: () => cloneDeep(commonStatus)
  },
  {
    url: '/dict/data/type/sys_common_category',
    method: 'get',
    callback: () => cloneDeep(categoryList)
  },
  {
    url: '/dict/data/type/sys_common_author',
    method: 'get',
    callback: () => cloneDeep(authorList)
  }
])
