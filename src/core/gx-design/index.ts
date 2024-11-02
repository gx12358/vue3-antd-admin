import InputSearch from '@gx-design/InputSearch'
import MaterialView from '@gx-design/MaterialView'
import { GImage, ImagePreview } from '@gx-design-vue/image'
import { GScrollbars } from '@gx-design-vue/scrollbar'

const gxDesign = (app) => {
  app.component('g-image', GImage)
  app.component('g-image-view', ImagePreview)
  app.component('g-scrollbars', GScrollbars)
  app.component('g-material-view', MaterialView)
  app.component('g-input-search', InputSearch)
}
export default gxDesign
