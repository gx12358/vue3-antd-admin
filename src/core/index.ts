import antDesign from './ant-design'
import gxAdminDesign from './gx-admin-design'
import setupGlobDirectives from './gx-admin-directives'

import gxDesign from './gx-design'
import gxProDesign from './gx-pro-design'

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
