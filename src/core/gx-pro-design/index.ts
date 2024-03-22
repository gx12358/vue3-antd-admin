import type { App } from 'vue'

import { PageContainer } from '@gx-design-vue/pro-layout'
import { GProTable } from '@gx-design-vue/pro-table'
import { GProModal } from '@gx-design-vue/pro-modal'

const gxProDesign = (app: App) => {
  // pro-wrapper
  app.component('g-pro-page-container', PageContainer)
  // pro-table
  app.component('g-pro-table', GProTable)
  // pro-modal
  app.component('g-pro-modal', GProModal)
  // pro-editor
}
export default gxProDesign
