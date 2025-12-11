import type { ComputedRef } from 'vue'
import { useContext } from '@gx-design-vue/pro-provider'

export interface AdvancedContextProps {
  isMobile: ComputedRef<boolean>;
}

export const {
  provideContext: provideAdvancedContext,
  useInjectContext: useAdvancedContext
} = useContext<AdvancedContextProps>('advanced-context')
