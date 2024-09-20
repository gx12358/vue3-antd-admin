import type { CancelOptions, GAxiosOptions } from '@/utils/request/typings'
import type { MaybeRef, Ref, UnwrapRef, WatchSource } from 'vue'
import { useState } from '@gx-design-vue/pro-hooks'
import { useThrottleFn } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { computed, isReactive, isRef, reactive, ref, watch } from 'vue'

type DefaultToT<T, R> = R extends undefined ? T : R

function useRequest<T, P = any, R = undefined, >(
  service: (opt: P, config?: Partial<GAxiosOptions>) => Promise<ResponseResult<T>>,
  options: {
    params?: MaybeRef<P>;
    stopWatchParams?: MaybeRef<boolean>;
    defaultData?: DefaultToT<T, R>;
    requestConfig?: Partial<GAxiosOptions>;
    manual?: boolean;
    defaultLoading?: boolean;
    ready?: Ref<boolean>;
    onBefore?: (params: P) => void;
    onSuccess?: (res: T) => void;
    onAfterMutateData?: (data: T) => Promise<DefaultToT<T, R>> | DefaultToT<T, R>;
    debounceInterval?: number;
    refreshDeps?: WatchSource[];
    refreshDepsAction?: () => Promise<any>;
  } = {}
) {
  const [ loading, setLoading ] = useState(!!options.defaultLoading)

  const data = ref<DefaultToT<T, R>>(options?.defaultData)

  const state = reactive<{ params: MaybeRef<P> }>({
    params: (isRef(options.params) ? options.params?.value : options.params) || {} as P
  })

  const requestCancel: Partial<CancelOptions> = {
    cancel: null,
    cancelAll: null
  }

  const ready = computed(() =>
    !isRef(options?.ready) || options?.ready?.value === undefined ? true : options?.ready?.value)

  const stopWatchParams = computed(() =>
    isRef(options?.stopWatchParams) ? options?.stopWatchParams?.value : options?.stopWatchParams)

  const mergeParams = (opt?: P) => Object.assign(
    state.params,
    {
      ...(opt || {}), ...((isRef(options.params)
        ? options.params?.value as P
        : options.params) || {})
    }
  ) as UnwrapRef<P>

  const query = async (opt?: P) => {
    setLoading(true)
    state.params = mergeParams()
    options.onBefore && options.onBefore?.(unref(state.params) as P)
    const requestConfig: Partial<GAxiosOptions> = {
      ...(options.requestConfig || {
        cancelCallBackHook: (cancelOptions) => {
          Object.assign(requestCancel, cancelOptions)
        }
      })
    }
    const response: ResponseResult<T> = await service(mergeParams(opt) as P, requestConfig)
    if (response) {
      data.value = options?.onAfterMutateData
        ? await options?.onAfterMutateData?.(cloneDeep(response.data))
        : cloneDeep(response.data) as any

      options.onSuccess && options.onSuccess?.(response.data)
    }

    setLoading(false)
  }

  const run = useThrottleFn<(opt?: P) => Promise<void>>(query, options.debounceInterval || 50)

  const refresh = () => run()

  if (!options.manual)
    run()

  if (options.refreshDeps?.length) {
    watch(options.refreshDeps, () => {
      if (options.refreshDepsAction) {
        options?.refreshDepsAction()
      } else {
        run()
      }
    }, {
      deep: true
    })
  }

  if ((isReactive(options.params) || isRef(options.params))) {
    watch(() => isRef(options.params) ? options.params?.value : options.params, () => {
      if (!stopWatchParams.value)
        query()
    }, { deep: true })
  }

  watch(() => ready.value, val => val && run())

  return {
    run,
    refresh,
    data,
    loading,
    params: computed(() => state.params),
    cancel: requestCancel.cancel,
    cancelAll: requestCancel.cancelAll
  }
}

export default useRequest
