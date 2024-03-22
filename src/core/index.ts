import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import 'dayjs/esm/locale/zh-cn'

import antDesign from './ant-design'
import gxDesign from './gx-design'
import gxProDesign from './gx-pro-design'

import gxAdminDesign from './gx-admin-design'
import setupGlobDirectives from './gx-admin-directives'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(weekOfYear)
dayjs.extend(advancedFormat)

export function setupGlobCommon(app) {
  // design
  antDesign()
  // gx-design
  gxDesign(app)
  gxProDesign(app)
  gxAdminDesign(app)
  // directives
  setupGlobDirectives(app)
}
