import type { InjectionKey, ComputedRef, Ref } from 'vue'
import { inject, provide } from 'vue'
import type { TabsKey } from '@gx-mock/datasSource/user/account'

export interface AccountCenterContextProps {
  /* 附加属性 */
  activeKey: ComputedRef<TabsKey>;
  countLoading: Ref<boolean>;
  isMobile: ComputedRef<boolean>;
  contentHeight: ComputedRef<string>;
  [key: string]: any;
}

const contextInjectKey: InjectionKey<AccountCenterContextProps> = Symbol('account-center-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<T> = Symbol(),
  defaultValue?: T
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideAccountCenterContext = (value: AccountCenterContextProps) => {
  provide(contextInjectKey, value)
}

export const useAccountCenterContext = (defaultValue?: Required<AccountCenterContextProps>) =>
  useContext<Required<AccountCenterContextProps>>(contextInjectKey, defaultValue)
