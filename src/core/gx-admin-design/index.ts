import Image from '@/components/GlobalLayout/Image'
import Spin from '@/components/GlobalLayout/Spin'

const gxAdminDesign = (app) => {
  app.component('g-spin', Spin)
  app.component('g-admin-image', Image)
}
export default gxAdminDesign
