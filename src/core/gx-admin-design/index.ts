import Spin from '@/components/GlobalLayout/Spin'
import Image from '@/components/GlobalLayout/Image'

const gxAdminDesign = (app) => {
  app.component('g-spin', Spin)
  app.component('g-admin-image', Image)
}
export default gxAdminDesign
