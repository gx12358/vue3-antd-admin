import Icon from '@/components/GDesign/Icon'
import AuthGroup from '@/components/GlobalLayout/AuthGroup/index.vue'
import Empty from '@/components/GlobalLayout/Empty/index.vue'
import Image from '@/components/GlobalLayout/Image'
import Spin from '@/components/GlobalLayout/Spin'
import Upload from '@/components/GlobalLayout/Upload'

const gxAdminDesign = (app) => {
  app.component('g-spin', Spin)
  app.component('g-icon', Icon)
  app.component('g-empty', Empty)
  app.component('g-auth-group', AuthGroup)
  app.component('g-admin-image', Image)
  app.component('g-admin-upload', Upload)
}
export default gxAdminDesign
