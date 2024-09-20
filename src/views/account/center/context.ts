import type { TabsKey } from '@gx-mock/datasSource/user/account'
import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { inject, provide } from 'vue'

export interface AccountCenterContextProps {
  /* 附加属性 */
  activeKey: ComputedRef<TabsKey>
  countLoading: Ref<boolean>
  isMobile: ComputedRef<boolean>
  contentHeight: ComputedRef<string>
  [key: string]: any
}

const contextInjectKey: InjectionKey<AccountCenterContextProps> = Symbol('account-center-context')

export function useContext<T>(
  injectKey: string | InjectionKey<T> = contextInjectKey,
  defaultValue?: T
) {
  return inject(injectKey, defaultValue || ({} as T))
}

export function provideAccountCenterContext(value: AccountCenterContextProps) {
  provide(contextInjectKey, value)
}

export function useAccountCenterContext(defaultValue?: Required<AccountCenterContextProps>) {
  return useContext<Required<AccountCenterContextProps>>(contextInjectKey, defaultValue)
}
