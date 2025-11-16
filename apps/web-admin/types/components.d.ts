import { GScrollbars } from '@gx-design-vue/scrollbar'
import { GProPageContainer } from '@gx-design-vue/pro-layout'
import { GProTable } from '@gx-design-vue/pro-table'
import { GProModal } from '@gx-design-vue/pro-modal'
import { GImage, GImagePreview } from '@gx-design-vue/image'
import { GProMediaView, GIcon } from '@gx/design'
import Upload from '@/components/layout/upload'
import GSpin from '@/components/layout/spin'
import GAdminImage from '@/components/layout/image'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    GSpin: typeof GSpin
    GImage: typeof GImage
    GIcon: typeof GIcon
    GAdminUpload: typeof Upload
    GAdminImage: typeof GAdminImage
    GProTable: typeof GProTable
    GProModal: typeof GProModal
    GScrollbars: typeof GScrollbars
    GImageView: typeof GImagePreview
    GProMediaView: typeof GProMediaView
    GProPageContainer: typeof GProPageContainer
  }
}
