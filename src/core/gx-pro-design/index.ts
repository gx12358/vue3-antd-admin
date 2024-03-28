import type { App } from 'vue'

import { PageContainer } from '@gx-design-vue/pro-layout'
import { GProTable } from '@gx-design-vue/pro-table'
import { GProModal } from '@gx-design-vue/pro-modal'

const gxProDesign = (app: App) => {
  app.component('g-pro-page-container', PageContainer)
  app.component('g-pro-table', GProTable)
  app.component('g-pro-modal', GProModal)
}
export default gxProDesign
