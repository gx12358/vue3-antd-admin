import type { Ref } from 'vue'
import { useContext } from '@gx-design-vue/pro-provider'

export interface AdvancedContextProps {
  showTableLoading: Ref<boolean>;

  [key: string]: any;
}

export const {
  provideContext: provideAdvancedContext,
  useInjectContext: useAdvancedContext
} = useContext<AdvancedContextProps>('advanced-context')
