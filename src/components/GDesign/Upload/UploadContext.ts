import type { ComputedRef, InjectionKey } from 'vue'
import type { MaterialListItem } from './typings'
import { inject, provide } from 'vue'

export type ContextType = any

export interface UploadContextProps {
  uploadList: ComputedRef<MaterialListItem[]>,

  /* 附加属性 */
  [key: string]: any;
}

const uploadContextInjectKey: InjectionKey<UploadContextProps> = Symbol('upload-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType> = uploadContextInjectKey,
  defaultValue?: ContextType
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideUploadContext = (value: UploadContextProps) => {
  provide(uploadContextInjectKey, value)
}

export const useUploadContext = () => useContext<Required<UploadContextProps>>(
  uploadContextInjectKey,
  []
)
