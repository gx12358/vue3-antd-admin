import { getLevelData } from '@gx-design-vue/pro-utils'
import { MOCK_MENUS } from '~/utils/menus-data'

export const AUTH_DATA = {
  1: getLevelData(structuredClone(MOCK_MENUS[1])).map(item => item.id),
  2: [1, 2, 1001]
}
