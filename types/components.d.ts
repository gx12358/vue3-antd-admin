import { GScrollbars } from '@gx-design-vue/scrollbar'
import { PageContainer } from '@gx-design-vue/pro-layout'
import { GProTable } from '@gx-design-vue/pro-table'
import { GProModal } from '@gx-design-vue/pro-modal'
import { GImage, ImageViewer } from '@gx-design-vue/image'
import MaterialView from '@gx-design/MaterialView'
import InputSearch from '@gx-design/InputSearch'
import GSpin from '@/components/GlobalLayout/Spin'
import GAdminImage from '@/components/GlobalLayout/Image'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    GSpin: typeof GSpin
    GImage: typeof GImage
    GAdminImage: typeof GAdminImage
    GProTable: typeof GProTable
    GProModal: typeof GProModal
    GScrollbars: typeof GScrollbars
    GImageViewer: typeof ImageViewer
    GInputSearch: typeof InputSearch
    GMaterialView: typeof MaterialView
    GProPageContainer: typeof PageContainer
  }
}
