import {
  defineComponent,
  InjectionKey,
  provide,
  inject,
  readonly,
  SetupContext,
  VNode,
  PropType,
  DefineComponent
} from 'vue'

// @ts-ignore
export type ContextType<T> = any;

// @ts-ignore
export type CreateContext<T> = DefineComponent<{}, () => VNode | VNode[] | undefined, any>;

export const createContext = <T>(
  contextInjectKey: InjectionKey<ContextType<T>> = Symbol(),
  injectCompName = 'Context.Provider'
): CreateContext<T> => {
  const ContextProvider = defineComponent({
    name: injectCompName,
    props: {
      value: {
        type: Object as PropType<ContextType<T>>,
        required: true
      }
    },
    setup(props: { value: ContextType<T> }, { slots }: SetupContext) {
      provide(contextInjectKey, readonly(props.value))
      return () => slots.default?.()
    }
  })

  return ContextProvider as any
}

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType<T>> = Symbol(),
  defaultValue?: ContextType<T>
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}
