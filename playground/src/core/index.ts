import antDesign from './ant-design'
import gxProDesign from './gx-pro-design'

export function setupGloblCommon(app) {
  // design
  antDesign()
  // gx-design
  gxProDesign(app)
}
