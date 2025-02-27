import type { CancelOptions, GAxiosOptions } from '@/utils/request/typings'
import type { ComputedRef, MaybeRef, UnwrapRef, WatchSource } from 'vue'
import { useState } from '@gx-design-vue/pro-hooks'
import { deepMerge, isArray, isObject } from '@gx-design-vue/pro-utils'
import { useThrottleFn } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { computed, isReactive, isRef, reactive, ref, watch } from 'vue'

type DefaultToT<T, R> = R extends undefined ? T : R

type RequestResponse<T> = T extends ResponseResult ? T : ResponseResult<T>

export type SearchParams<P = Record<string, undefined>> = MaybeRef<P> | ComputedRef<P>

/**
 * 使用请求的自定义 Hook
 * @template T - 返回data数据的类型
 * @template P - 请求参数的类型，默认为 Record<string, any>
 * @template R - 整体响应的类型，默认为 undefined
 * @param {Function} service - 服务函数，用于发起请求
 * @param {object} options - 配置选项
 * @param {object} options.params - 请求参数，类型为 SearchParams<P>
 * @param {boolean} [options.manual] - 是否需要手动触发首次请求，默认值为 false
 * @param {object} [options.cancel] - 用于控制请求取消行为的配置对象
 * @param {boolean} [options.cancel.level] - 若为 true，表示离开页面时取消上一次请求；若为 false 则不启用此功能
 * @param {boolean} [options.cancel.next] - 若为 true，表示下次请求时取消上次请求；若为 false 则不启用此功能
 * @returns {object} - 包含请求控制方法和状态的对象
 * @returns {DefaultToT<T, R>} data - 请求返回的数据，类型为 DefaultToT<T, R>
 * @returns {boolean} loading - 表示请求是否正在进行中
 * @returns {(opt?: P) => Promise<void>} run - 用于发起请求的函数，可传入请求参数
 * @returns {() => void} refresh - 按照当前参数再次发起请求的函数
 */
function useRequest<T, P = Record<string, any>, R = undefined>(
  service: (opt: P, config?: Partial<GAxiosOptions>) => Promise<RequestResponse<DefaultToT<T, R>>>,
  options: {
    params?: SearchParams<P>;
    watchParams?: MaybeRef<boolean>;
    defaultData?: T;
    requestConfig?: Partial<GAxiosOptions>;
    cancel?: {
      level?: boolean;
      next?: boolean;
    };
    pageActivated?: boolean;
    defaultLoading?: boolean;
    manual?: MaybeRef<boolean>;
    onBefore?: (params: P) => P | unknown;
    onSuccess?: (data: T, response: RequestResponse<DefaultToT<T, R>>) => void;
    onError?: (e: any) => void;
    onFinal?: () => void;
    onAfterMutateData?: (response: RequestResponse<DefaultToT<T, R>>) => Promise<T> | T;
    debounceInterval?: number;
    refreshDeps?: WatchSource[];
    refreshDepsAction?: () => Promise<any>;
  } = {}
) {
  const [ init, setInit ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState(!!options.defaultLoading)

  const data = ref<T>(options?.defaultData as T)

  const state = reactive<{ params: P, result: RequestResponse<DefaultToT<T, R>> }>({
    params: (isRef(options.params) ? options.params?.value : options.params) || {} as P,
    result: undefined as any
  })

  const requestCancel: Partial<CancelOptions> = {
    cancel: undefined,
    cancelAll: undefined
  }

  const manual = computed(() =>
    isRef(options?.manual) ? options?.manual?.value ?? false : options?.manual ?? false)

  const watchParams = computed(() =>
    isRef(options?.watchParams) ? options?.watchParams?.value ?? true : options?.watchParams ?? true)

  function mergeParams(val?: P): P {
    if (val && isObject(val)) {
      return deepMerge<any>(
        cloneDeep(state.params) as P,
        cloneDeep({
          ...((isRef(options.params)
            ? options.params?.value as P
            : options.params) || {}),
          ...val
        } as any),
        {
          omitEmpty: false,
          omitNil: false
        }
      )
    }

    if (val) {
      return val as unknown as P
    }
    return cloneDeep(state.params) as unknown as P
  }

  const query = async (opt?: P) => {
    if (options?.cancel?.next && typeof requestCancel.cancel === 'function') requestCancel.cancel?.()
    setLoading(true)
    state.params = mergeParams(opt) as unknown as UnwrapRef<P>
    if (options.onBefore) {
      const value = options.onBefore(cloneDeep(state.params) as P) as unknown as UnwrapRef<P>
      if (value) state.params = value as unknown as UnwrapRef<P>
    }
    const requestConfig: Partial<GAxiosOptions> = {
      ...(options.requestConfig || {
        cancelCallBackHook: (cancelOptions) => {
          Object.assign(requestCancel, cancelOptions)
        }
      })
    }

    try {
      const response: RequestResponse<DefaultToT<T, R>> = await service(cloneDeep(state.params as P), requestConfig)
      if (response) {
        data.value = options?.onAfterMutateData
          ? await options?.onAfterMutateData?.(response)
          : response.data

        options.onSuccess && options.onSuccess?.(data.value, response)
        state.result = isObject(response) || isArray(response) ? cloneDeep(response as any) : response as any
      } else {
        options.onError && options.onError?.(response)
      }
    } catch (e) {
      console.error(e)
      options.onError && options.onError?.(e)
    }

    options.onFinal && options.onFinal?.()

    setLoading(false)
    setInit(true)
  }

  const run = useThrottleFn<(opt?: P) => Promise<void>>(query, options.debounceInterval || 50)

  const refresh = () => run()

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
    if (watchParams.value) {
      watch(() => isRef(options.params) ? options.params?.value : options.params, (val) => {
        query(val)
      }, { deep: true })
    }
  }

  watch(manual, val => !val && run())

  onMounted(() => {
    if (!manual.value) run()
  })

  onActivated(() => {
    if (!manual.value && options?.pageActivated) run()
  })

  if (options.cancel?.level) {
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
    params: computed(() => state.params),
    result: computed(() => state.result),
    cancel: requestCancel.cancel,
    cancelAll: requestCancel.cancelAll
  }
}

export default useRequest
