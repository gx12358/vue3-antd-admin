import { menuList } from '@gx-mock/config/menu'
import { getMockRequest } from '@gx-mock/util/utils'

export default [
  getMockRequest({
    url: '/menu/navigate',
    method: 'post',
    callback: () => menuList
  })
]
