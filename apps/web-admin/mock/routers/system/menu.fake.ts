import { menuList } from '../../config/menu'
import { createMockRoute } from '../../index'

export default createMockRoute({
  url: '/menu/navigate',
  method: 'post',
  callback: menuList
})
