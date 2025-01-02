import type { CancelOptions, GAxiosOptions } from '@/utils/request/typings'
import type { ComputedRef, MaybeRef, Ref, UnwrapRef, WatchSource } from 'vue'
import { useState } from '@gx-design-vue/pro-hooks'
import { deepMerge, isObject } from '@gx-design-vue/pro-utils'
import { useThrottleFn } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { computed, isReactive, isRef, reactive, ref, watch } from 'vue'

type DefaultToT<T, R> = R extends undefined ? T : R

type RequestResponse<T> = T extends ResponseResult ? T : ResponseResult<T>

export type SearchParams<P = Record<string, undefined>> = MaybeRef<P> | ComputedRef<P>

function useRequest<T, P = Record<string, any>, R = undefined>(
  service: (opt: P, config?: Partial<GAxiosOptions>) => Promise<RequestResponse<T>>,
  options: {
    params?: SearchParams<P>;
    stopWatchParams?: MaybeRef<boolean>;
    defaultData?: DefaultToT<T, R>;
    requestConfig?: Partial<GAxiosOptions>;
    manual?: boolean;
    defaultLoading?: boolean;
    ready?: Ref<boolean>;
    onBefore?: (params: P) => void;
    onSuccess?: (data: DefaultToT<T, R>, response: RequestResponse<T>) => void;
    onFinal?: () => void;
    onAfterMutateData?: (response: RequestResponse<T>) => Promise<DefaultToT<T, R>> | DefaultToT<T, R>;
    debounceInterval?: number;
    refreshDeps?: WatchSource[];
    refreshDepsAction?: () => Promise<any>;
  } = {}
) {
  const [ init, setInit ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState(!!options.defaultLoading)

  const data = ref<DefaultToT<T, R>>(options?.defaultData as DefaultToT<T, R>)

  const state = reactive<{ params: P }>({
    params: (isRef(options.params) ? options.params?.value : options.params) || {} as P
  })

  const requestCancel: Partial<CancelOptions> = {
    cancel: undefined,
    cancelAll: undefined
  }

  const ready = computed(() =>
    !isRef(options?.ready) || options?.ready?.value === undefined ? true : options?.ready?.value)

  const stopWatchParams = computed(() =>
    isRef(options?.stopWatchParams) ? options?.stopWatchParams?.value : options?.stopWatchParams)

  const mergeParams = (opt?: P) => {
    if (opt && isObject(opt)) {
      return deepMerge(
        cloneDeep(state.params) as any,
        cloneDeep({
          ...((isRef(options.params)
            ? options.params?.value as P
            : options.params) || {}),
          ...(opt || {})
        }),
        {
          omitEmpty: false,
          omitNil: false
        }
      ) as UnwrapRef<P>
    }

    if (opt) {
      state.params = opt as any
    }
    return state.params
  }

  const query = async (opt?: P) => {
    setLoading(true)
    state.params = mergeParams(opt)
    options.onBefore && options.onBefore?.(unref(state.params) as P)
    const requestConfig: Partial<GAxiosOptions> = {
      ...(options.requestConfig || {
        cancelCallBackHook: (cancelOptions) => {
          Object.assign(requestCancel, cancelOptions)
        }
      })
    }
    const response: RequestResponse<T> = await service(mergeParams(opt) as P, requestConfig)
    if (response) {
      data.value = options?.onAfterMutateData
        ? await options?.onAfterMutateData?.(response)
        : cloneDeep(response.data) as any

      options.onSuccess && options.onSuccess?.(data.value, response)
    }

    options.onFinal && options.onFinal?.()

    setLoading(false)
    setInit(true)
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
    watch(() => isRef(options.params) ? options.params?.value : options.params, (params) => {
      if (!stopWatchParams.value)
        query(params)
    }, { deep: true })
  }

  watch(() => ready.value, val => val && run())

  return {
    run,
    refresh,
    data,
    loading,
    init,
    params: computed(() => state.params),
    cancel: requestCancel.cancel,
    cancelAll: requestCancel.cancelAll
  }
}

export default useRequest
