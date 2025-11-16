import { GImage, GImagePreview } from '@gx-design-vue/image'
import { GScrollbars } from '@gx-design-vue/scrollbar'

const gxDesign = (app) => {
  app.component('g-image', GImage)
  app.component('g-image-view', GImagePreview)
  app.component('g-scrollbars', GScrollbars)
}
export default gxDesign
