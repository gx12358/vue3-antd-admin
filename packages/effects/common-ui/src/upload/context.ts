import type { ComputedRef } from 'vue'
import type { MaterialListItem } from './typings'
import { useContext } from '@gx-design-vue/pro-provider'

export interface UploadContextProps {
  uploadList: ComputedRef<MaterialListItem[]>,
}

export const { provideContext: provideUploadContext, useInjectContext: useUploadContext } = useContext<UploadContextProps>('upload')
