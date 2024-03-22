import type { InjectionKey, Ref } from 'vue'
import { inject, provide } from 'vue'

export interface AdvancedContextProps {
  showTableLoading: Ref<boolean>;
  [key: string]: any;
}

const contextInjectKey: InjectionKey<AdvancedContextProps> = Symbol('advanced-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<T> = Symbol(),
  defaultValue?: T
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideAdvancedContext = (value: AdvancedContextProps) => {
  provide(contextInjectKey, value)
}

export const useAdvancedContext = (defaultValue?: Required<AdvancedContextProps>) =>
  useContext<Required<AdvancedContextProps>>(contextInjectKey, defaultValue)
