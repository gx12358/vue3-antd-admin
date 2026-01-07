import type { Ref } from 'vue'
import type { SystemDictTypeApi } from '@/services/system/dict'
import { useContext } from '@gx-design-vue/context'

export interface DictContext {
  rowSelect: Ref<SystemDictTypeApi.DictTypeTableRecord>;
}

export const {
  useInjectContext: useDictContext,
  provideContext: provideDictContext
} = useContext<DictContext>('dict')
