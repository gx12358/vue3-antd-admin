import type { ComputedRef, Ref } from 'vue'
import { useContext } from '@gx-design-vue/pro-provider'

export interface SearchListContextProps {
  /* 附加属性 */
  loading: Ref<boolean>;
  keyword: ComputedRef<string>;
  classData: ComputedRef<SystemDictRecord[]>;

  [key: string]: any;
}

export const {
  useInjectContext: useSearchListContext,
  provideContext: provideSearchListContext
} = useContext<SearchListContextProps>('search-list')
