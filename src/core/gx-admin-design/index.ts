import { Documentation, PageLoading } from '@/components'

const gxAdminDesign = (app) => {
  // doc
  app.component('g-doc', Documentation)
  // pro-loading
  app.component('g-page-loading', PageLoading)
}
export default gxAdminDesign
