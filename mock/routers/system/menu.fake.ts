import { createMockRoute } from '../../../mock'
import { menuList } from '../../config/menu'

export default createMockRoute({
  url: '/menu/navigate',
  method: 'post',
  callback: menuList
})
