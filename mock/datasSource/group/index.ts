import { groupList } from '@gx-mock/config/group'
import { compareArray } from '@gx-design-vue/pro-utils'
import { getMockRequest } from '@gx-mock/util/utils'

export interface GroupListItem {
  id: number;
  icon: string;
  title: string;
  creatTime: string;
  joinNum?: number;
}

export default [
  getMockRequest({
    url: '/group/top',
    method: 'get',
    callback: () => {
      return {
        data: groupList.sort((a, b) => compareArray(a, b, 'joinNum', 1))
          .filter((_, sort) => sort < 6)
      }
    }
  })
]
