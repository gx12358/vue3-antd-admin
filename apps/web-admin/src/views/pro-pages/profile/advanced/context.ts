import type { ComputedRef } from 'vue'
import { useContext } from '@gx-design-vue/context'

export interface AdvancedContextProps {
  isMobile: ComputedRef<boolean>;
}

export const {
  provideContext: provideAdvancedContext,
  useInjectContext: useAdvancedContext
} = useContext<AdvancedContextProps>('advanced-context')
