import type { Ref } from 'vue'
import { useContext } from '@gx-design-vue/pro-provider'

export interface CenterContextProps {
  loading: Ref<boolean>;
  activeKey: Ref<'basic' | 'password'>;
}

export const {
  provideContext,
  useInjectContext
} = useContext<CenterContextProps>('account-center')
