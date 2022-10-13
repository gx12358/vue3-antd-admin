import { ComputedRef, DefineComponent, inject, InjectionKey, provide, VNode } from 'vue'
import { MaterialListItem } from './typings'

// @ts-ignore
export type ContextType<T> = any;

// @ts-ignore
export type CreateContext<T> = DefineComponent<{}, () => VNode | VNode[] | undefined, any>;

export interface UploadContextProps {
  uploadList: ComputedRef<MaterialListItem[]>,
  /* 附加属性 */
  [key: string]: any;
}

const uploadContextInjectKey: InjectionKey<UploadContextProps> = Symbol('upload-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType<T>> = Symbol(),
  defaultValue?: ContextType<T>
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideUploadContext = (value: UploadContextProps | ComputedRef<UploadContextProps>) => {
  provide(uploadContextInjectKey, value)
}

export const useUploadContext = () =>
  useContext<Required<UploadContextProps>>(uploadContextInjectKey, [])
