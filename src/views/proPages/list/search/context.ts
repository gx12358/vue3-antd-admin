import type { InjectionKey, ComputedRef, Ref } from 'vue'
import { inject, provide } from 'vue'
import { TagsListItem } from './components/typings'

export interface SearchListContextProps {
  /* 附加属性 */
  loading: Ref<boolean>;
  keyword: ComputedRef<string>;
  classData: ComputedRef<TagsListItem[]>;
  [key: string]: any;
}

const contextInjectKey: InjectionKey<SearchListContextProps> = Symbol('search-list-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<T> = Symbol(),
  defaultValue?: T
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideSearchListContext = (value: SearchListContextProps) => {
  provide(contextInjectKey, value)
}

export const useSearchListContext = (defaultValue?: Required<SearchListContextProps>) =>
  useContext<Required<SearchListContextProps>>(contextInjectKey, defaultValue)
