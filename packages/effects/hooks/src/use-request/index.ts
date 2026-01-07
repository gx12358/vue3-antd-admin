import type { LimitDeepPartial, WithIfDefault } from '@gx-design-vue/pro-utils'
import type { CancelOptions, RequestOptions } from '@gx/request'
import type { ComputedRef, MaybeRef, Reactive, WatchSource } from 'vue'
import { useReactiveState, useState } from '@gx-design-vue/pro-hooks'
import { cloneDeep, getRandomNumber } from '@gx-design-vue/pro-utils'
import { useThrottleFn } from '@vueuse/core'
import { computed, isReactive, isRef, onActivated, onMounted, ref, toRaw, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

/**
 * 使用请求的自定义 Hook
 * @template T - 返回data数据的类型
 * @template P - 请求参数的类型，默认为 Record<any, any>
 */
export function useRequest<T, P extends object = Record<any, any>, R = undefined>(
  service: any,
  props: {
    params?: MaybeRef<P> | ComputedRef<P> | Reactive<P>;
    watchParams?: MaybeRef<boolean>;
    defaultData?: T;
    requestConfig?: Partial<RequestOptions>;
    cancel?: {
      level?: boolean;
      next?: boolean;
    };
    pageActivated?: boolean;
    defaultLoading?: boolean;
    manual?: MaybeRef<boolean>;
    onBefore?: (params: P) => LimitDeepPartial<P> | undefined | void;
    onSuccess?: (data: WithIfDefault<T, R>) => T | unknown;
    onError?: (e: any) => void;
    onFinal?: () => void;
    debounceInterval?: number;
    refreshDeps?: WatchSource[];
    refreshDepsAction?: () => Promise<any>;
  } = {}
) {
  const updateKey = ref<string>('')
  const [ init, setInit ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState(!!props.defaultLoading)

  const data = ref<T>(props?.defaultData as T)

  const defaultParams = cloneDeep(props.params
    ? isRef(props.params) ? props.params?.value : props.params
    : {} as P)

  const [ state, setState, resetState ] = useReactiveState<P>(cloneDeep(defaultParams))

  const requestCancel: Partial<CancelOptions> = {
    cancel: undefined,
    cancelAll: undefined
  }

  const manual = computed(() =>
    isRef(props?.manual) ? props?.manual?.value ?? false : props?.manual ?? false)

  const watchParams = computed(() =>
    isRef(props?.watchParams)
      ? props?.watchParams?.value ?? true
      : props?.watchParams ?? true)

  // 保持最新的更新
  function update(key: string, callback?: () => void) {
    if (key === updateKey.value) {
      if (callback) callback()
    }
  }

  const query = async (options?: { params?: LimitDeepPartial<P>; reset?: boolean; }) => {
    const requestKey = `use_request_${getRandomNumber().uuid(10)}`
    updateKey.value = requestKey
    if (props?.cancel?.next && typeof requestCancel.cancel === 'function') requestCancel.cancel?.()
    setLoading(true)
    if (options?.reset) {
      resetState()
    } else if (options?.params) {
      setState(options?.params)
    }
    if (props.onBefore) {
      const newParams = props.onBefore(toRaw(state) as P)
      if (newParams) setState(newParams)
    }

    try {
      const response: T = await service(cloneDeep(state), {
        ...(props.requestConfig || {
          cancelCallBackHook: (cancelOptions) => {
            Object.assign(requestCancel, cancelOptions)
          }
        })
      })

      update(requestKey, () => {
        if (props.onSuccess) {
          const newData = props.onSuccess(response as any)
          if (newData) data.value = cloneDeep(newData)
        } else {
          data.value = cloneDeep(response)
        }
      })
    } catch (e) {
      update(requestKey, () => {
        console.error(e)
        props.onError && props.onError?.(e)
      })
    }

    update(requestKey, () => {
      props.onFinal && props.onFinal?.()
    })

    update(requestKey, () => {
      setLoading(false)
      setInit(true)
    })
  }

  const run = useThrottleFn<(props?: {
    params?: LimitDeepPartial<P>;
    reset?: boolean;
  }) => Promise<void>>(query, props.debounceInterval || 50)

  const refresh = () => run({ reset: true })

  if (props.refreshDeps?.length) {
    watch(props.refreshDeps, () => {
      if (props.refreshDepsAction) {
        props?.refreshDepsAction()
      } else {
        run()
      }
    }, {
      deep: true
    })
  }
  if (props.params && (isReactive(props.params) || isRef(props.params))) {
    watch(() => isRef(props.params) ? props.params?.value : props.params, (newParams) => {
      if (watchParams.value) {
        setState(newParams)
        run(newParams as any)
      }
    }, { deep: true })
  }

  watch(manual, val => !val && run())

  onMounted(() => {
    if (!manual.value) run()
  })

  onActivated(() => {
    if (!manual.value && props?.pageActivated) run()
  })

  if (props.cancel?.level) {
    onBeforeRouteLeave(() => {
      requestCancel?.cancel?.()
    })
  }

  return {
    run,
    refresh,
    data,
    loading,
    init,
    defaultParams,
    params: computed(() => cloneDeep(state)),
    cancel: requestCancel.cancel,
    cancelAll: requestCancel.cancelAll
  }
}
