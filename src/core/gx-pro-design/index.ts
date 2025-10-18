import type { App } from 'vue'

import { GProPageContainer } from '@gx-design-vue/pro-layout'
import { GProModal } from '@gx-design-vue/pro-modal'
import { GProTable } from '@gx-design-vue/pro-table'

const gxProDesign = (app: App) => {
  app.component('g-pro-page-container', GProPageContainer)
  app.component('g-pro-table', GProTable)
  app.component('g-pro-modal', GProModal)
}
export default gxProDesign
