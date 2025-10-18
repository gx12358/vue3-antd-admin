import type { MaterialListItem } from './typings'
import { useContext } from '@gx-design-vue/pro-provider'

export interface UploadContextProps {
  uploadList: ComputedRef<MaterialListItem[]>,

  /* 附加属性 */
  [key: string]: any;
}

export const { provideContext: provideUploadContext, useInjectContext: useUploadContext } = useContext<UploadContextProps>('upload')
