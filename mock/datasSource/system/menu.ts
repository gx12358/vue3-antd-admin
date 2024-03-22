import { getMockRequest } from '@gx-mock/util/utils'
import { menuList } from '@gx-mock/config/menu'

export default [
  getMockRequest({
    url: '/menu/navigate',
    method: 'post',
    callback: () => menuList
  })
]
