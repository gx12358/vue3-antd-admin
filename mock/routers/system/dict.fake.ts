import { cloneDeep } from 'lodash-es'
import { createMockRoute } from '../../../mock'
import { authorList, categoryList, commonStatus } from '../../config/dict'

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
