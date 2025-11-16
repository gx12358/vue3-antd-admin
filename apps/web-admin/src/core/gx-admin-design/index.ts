import AuthGroup from '@/components/layout/auth-group/index.vue'
import Empty from '@/components/layout/empty/index.vue'
import Image from '@/components/layout/image'
import Spin from '@/components/layout/spin'
import Upload from '@/components/layout/upload'

const gxAdminDesign = (app) => {
  app.component('g-spin', Spin)
  app.component('g-empty', Empty)
  app.component('g-auth-group', AuthGroup)
  app.component('g-admin-image', Image)
  app.component('g-admin-upload', Upload)
}
export default gxAdminDesign
