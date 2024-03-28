import { GScrollbars } from '@gx-design-vue/scrollbar'
import { GImage, ImageViewer } from '@gx-design-vue/image'
import MaterialView from '@gx-design/MaterialView'
import InputSearch from '@gx-design/InputSearch'

const gxDesign = (app) => {
  app.component('g-image', GImage)
  app.component('g-image-viewer', ImageViewer)
  app.component('g-scrollbars', GScrollbars)
  app.component('g-material-view', MaterialView)
  app.component('g-input-search', InputSearch)
}
export default gxDesign
