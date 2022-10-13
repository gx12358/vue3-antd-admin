import ProLayout, { PageContainer } from '@gx-design/ProLayout'
import ProTable from '@gx-design/ProTable'
import ProModal from '@gx-design/ProModal'
import ProEditor from '@gx-design/ProEditor'
import ProWatermark from '@gx-design/ProWatermark'
import ProSkeleton from '@gx-design/ProSkeleton'
import ProCard, {
  GProCardGroup,
  GProCardDivider,
  GProCardTabPane
} from '@gx-design/ProCard'

const gxProDesign = (app) => {
  // pro-layout
  app.component('g-pro-layout', ProLayout)
  // pro-wrapper
  app.component('g-pro-page-container', PageContainer)
  // pro-card
  app.component('g-pro-card', ProCard)
  app.component('g-pro-card-group', GProCardGroup)
  app.component('g-pro-card-divider', GProCardDivider)
  app.component('g-pro-card-tab-pane', GProCardTabPane)
  // pro-table
  app.component('g-pro-table', ProTable)
  // pro-modal
  app.component('g-pro-modal', ProModal)
  // pro-skeleton
  app.component('g-pro-skeleton', ProSkeleton)
  // pro-watermark
  app.component('g-pro-watermark', ProWatermark)
  // pro-editor
  app.component('g-pro-editor', ProEditor)
}
export default gxProDesign
