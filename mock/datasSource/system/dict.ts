import { cloneDeep } from 'lodash-es'
import { getMockRequest } from '@gx-mock/util/utils'
import { authorList, categoryList, commonStatus } from '@gx-mock/config/dict'

export default [
  getMockRequest({
    url: '/dict/data/type/sys_common_status',
    method: 'get',
    callback: () => cloneDeep(commonStatus)
  }),
  getMockRequest({
    url: '/dict/data/type/sys_common_category',
    method: 'get',
    callback: () => cloneDeep(categoryList)
  }),
  getMockRequest({
    url: '/dict/data/type/sys_common_author',
    method: 'get',
    callback: () => cloneDeep(authorList)
  }),
]
