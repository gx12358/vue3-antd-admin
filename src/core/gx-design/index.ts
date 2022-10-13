import Code from '@gx-design/Code'
import Affix from '@gx-design/Affix'
import Result from '@gx-design/Result'
import Anchor from '@gx-design/Anchor'
import Upload from '@gx-design/Upload'
import BackTop from '@gx-design/BackTop'
import Skeleton from '@gx-design/Skeleton'
import ColorPicker from '@gx-design/ColorPicker'
import InputSearch from '@gx-design/InputSearch'
import MaterialView from '@gx-design/MaterialView'
import Scrollbars from '@gx-design/Scrollbars'
import TagSelect from '@gx-design/TagSelect'
import TagSelectOption from '@gx-design/TagSelect/TagSelectOption'
import Image, { ImageViewer, ImageViewerGroup } from '@gx-design/Image'

const gxDesign = (app) => {
  // Code
  app.component('g-code', Code)
  // image
  app.component('g-image', Image)
  app.component('g-image-viewer', ImageViewer)
  app.component('g-image-viewer-group', ImageViewerGroup)
  // affix
  app.component('g-affix', Affix)
  // upload
  app.component('g-upload', Upload)
  // result
  app.component('g-result', Result)
  // anchor
  app.component('g-anchor', Anchor)
  // backtop
  app.component('g-back-top', BackTop)
  // scrollbars
  app.component('g-bars', Scrollbars)
  // skeleton
  app.component('g-skeleton', Skeleton)
  // color-picker
  app.component('g-color', ColorPicker)
  // tag-select
  app.component('g-tag-select', TagSelect)
  app.component('g-tag-select-option', TagSelectOption)
  // input-search
  app.component('g-input-search', InputSearch)
  // material-view
  app.component('g-material-view', MaterialView)
}
export default gxDesign
