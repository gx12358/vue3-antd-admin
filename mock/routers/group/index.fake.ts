import { compareArray } from '@gx-design-vue/pro-utils'
import { createMockRoute } from '../../../mock'
import { groupList } from '../../config/group'

export interface GroupListItem {
  id: number;
  icon: string;
  title: string;
  creatTime: string;
  joinNum?: number;
}

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
