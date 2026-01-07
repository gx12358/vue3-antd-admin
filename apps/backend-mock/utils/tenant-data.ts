import { getLevelData } from '@gx-design-vue/pro-utils'
import { MOCK_MENUS } from '~/utils/menus-data'

export const TENANT_PACKAGE = [
  {
    'id': 111,
    'name': '普通套餐',
    'status': 0,
    'remark': '小功能',
    'menuIds': getLevelData(structuredClone(MOCK_MENUS[1])).map(item => item.id),
    'createTime': 1645462440000
  }
]
