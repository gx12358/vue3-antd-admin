import type { Ref } from 'vue'
import { useContext } from '@gx-design-vue/context'

export interface CenterContextProps {
  loading: Ref<boolean>;
  activeKey: Ref<'basic' | 'password'>;
}

export const {
  provideContext,
  useInjectContext
} = useContext<CenterContextProps>('account-center')
