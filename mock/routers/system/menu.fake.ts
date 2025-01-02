import { createMockRoute } from '@gx-mock'
import { menuList } from '@gx-mock/config/menu'

export default createMockRoute({
  url: '/menu/navigate',
  method: 'post',
  callback: menuList
})
