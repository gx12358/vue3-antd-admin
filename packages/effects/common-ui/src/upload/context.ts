import type { Ref } from 'vue'
import type { MaterialListItem } from './typings'
import { useContext } from '@gx-design-vue/pro-provider'

export interface UploadContextProps {
  list: Ref<MaterialListItem[]>;
  onView: (row: MaterialListItem) => void
  onDelete: (row: MaterialListItem) => Promise<void>
  onDownload: (row: MaterialListItem) => Promise<void>
}

export const { provideContext: provideUploadContext, useInjectContext: useUploadContext } = useContext<UploadContextProps>('upload')
