import { compareArray } from '@gx-design-vue/pro-utils'
import { groupList } from '../../config/group'
import { createMockRoute } from '../../index'

export default createMockRoute({
  url: '/group/top',
  method: 'get',
  callback: () => {
    return {
      data: groupList.sort((a, b) => compareArray(a, b, 'joinNum', 1))
        .filter((_, sort) => sort < 6)
    }
  }
})
