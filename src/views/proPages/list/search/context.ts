import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { TagsListItem } from './components/typings'
import { inject, provide } from 'vue'

export interface SearchListContextProps {
  /* 附加属性 */
  loading: Ref<boolean>;
  keyword: ComputedRef<string>;
  classData: ComputedRef<TagsListItem[]>;

  [key: string]: any;
}

const searchListContextInjectKey: InjectionKey<SearchListContextProps> = Symbol(
  'search-list-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<T> = searchListContextInjectKey,
  defaultValue?: T
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideSearchListContext = (value: SearchListContextProps) => {
  provide(searchListContextInjectKey, value)
}

export const useSearchListContext = (defaultValue?: Required<SearchListContextProps>) =>
  useContext<Required<SearchListContextProps>>(searchListContextInjectKey, defaultValue)
