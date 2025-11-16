import type { TabsKey } from '@gx-mock/routers/user/account.fake'
import type { ComputedRef, Ref } from 'vue'
import { useContext } from '@gx-design-vue/pro-provider'

export interface AccountCenterContextProps {
  /* 附加属性 */
  activeKey: ComputedRef<TabsKey>
  countLoading: Ref<boolean>
  isMobile: ComputedRef<boolean>
  contentHeight: ComputedRef<string | undefined>

  [key: string]: any
}

export const {
  useInjectContext: useAccountCenterContext,
  provideContext: provideAccountCenterContext
} = useContext<AccountCenterContextProps>('account-center')
