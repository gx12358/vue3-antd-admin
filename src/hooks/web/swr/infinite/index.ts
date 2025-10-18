import type { fetcherFn, revalidateOptions, SWRInfiniteHook } from '../utils'
import type { SWRInfiniteCacheValue, SWRInfiniteConfiguration, SWRInfiniteKeyLoader } from './types'
import { useMounted } from '@vueuse/core'
import { computed, ref } from 'vue'
import useSwr from '../index/use-swr'
import { createCacheHelper, INFINITE_PREFIX, isFunction, isUndefined, serialize, UNDEFINED, withArgs } from '../utils'
import { getFirstPageKey } from './serialize'

const EMPTY_PROMISE = Promise.resolve() as Promise<undefined>

export function useSWRInfinite<Data = any, Error = any>(
  getKey: SWRInfiniteKeyLoader,
  fn: fetcherFn<Data> | undefined | null,
  config: SWRInfiniteConfiguration
) {
  const {
    cache,
    initialSize = 1,
    revalidateAll = false,
    persistSize = false,
    revalidateFirstPage = true,
    revalidateOnMount = false,
  } = config

  const isMounted = useMounted()
  const didMountRef = ref(false)

  const infiniteKey = computed(() => {
    // The serialized key of the first page. This key will be used to store
    // metadata of this SWR infinite hook.
    let key: string | undefined
    try {
      key = getFirstPageKey(getKey)
      if (key) key = INFINITE_PREFIX + key
    } catch {
      // Not ready yet.
    }
    return key
  })

  const [get, set] = createCacheHelper<
    Data,
    SWRInfiniteCacheValue<Data, any>
  >(cache, infiniteKey)

  const resolvePageSize = (): number => {
    const cachedPageSize = get()?.data?._l
    return isUndefined(cachedPageSize) ? initialSize : cachedPageSize
  }

  const lastPageSizeRef = ref(resolvePageSize())

  watch(infiniteKey, () => {
    if (isMounted.value) {
      if (!didMountRef.value) {
        didMountRef.value = true
        return
      }

      if (infiniteKey.value) {
        // If the key has been changed, we keep the current page size if persistSize is enabled
        // Otherwise, we reset the page size to cached pageSize
        set({ key: infiniteKey.value, _l: persistSize ? lastPageSizeRef.value : resolvePageSize() })
      }
    }
  }, { immediate: true })

  const shouldRevalidateOnMount = computed(() => revalidateOnMount && !didMountRef.value)

  const swr = useSwr<Data[], Error>(
    infiniteKey,
    async (key) => {
      const forceRevalidateAll = get()?.data?._i
      const shouldRevalidatePage = get()?.data?._r
      set({ _r: UNDEFINED })

      const data: Data[] = []

      const pageSize = resolvePageSize()
      const [getCache] = createCacheHelper<
        Data,
        SWRInfiniteCacheValue<Data[], any>
      >(cache, key)

      const cacheData = getCache()?.data?.data

      let previousPageData: any = null
      for (let i = 0; i < pageSize; ++i) {
        const pageArg = getKey(i, previousPageData)
        const pageKey = serialize(pageArg)

        const [getSWRCache, setSWRCache] = createCacheHelper<
          Data,
          SWRInfiniteCacheValue<Data, any>
        >(cache, pageKey)

        if (!pageKey) {
          // `pageKey` is falsy, stop fetching new pages.
          break
        }

        let pageData = getSWRCache()?.data?.data as Data

        const shouldFetchPage
          = revalidateAll
          || forceRevalidateAll
          || isUndefined(pageData)
          || (revalidateFirstPage && !i && !isUndefined(cacheData))
          || shouldRevalidateOnMount
          || (cacheData
            && !isUndefined(cacheData[i]))
        if (
          fn
          && (typeof shouldRevalidatePage === 'function'
            ? shouldRevalidatePage(pageData, pageArg)
            : shouldFetchPage)
        ) {
          const revalidate = async () => {
            pageData = await fn(pageArg)
            setSWRCache({ data: pageData, _k: pageArg })
            data[i] = pageData
          }
          await revalidate()
        } else {
          data[i] = pageData
        }

        previousPageData = pageData
      }

      // once we executed the data fetching based on the context, clear the context
      set({ _i: UNDEFINED })

      // return the data
      return data
    },
    config)

  const mutate = async (
    data?: fetcherFn<Data[]>,
    opts?: revalidateOptions
  ) => {
    const options
      = typeof opts === 'boolean' ? { forceRevalidate: opts } : opts || {}

    const shouldRevalidate = options.forceRevalidate !== false

    if (shouldRevalidate) {
      if (!isUndefined(data)) {
        // We only revalidate the pages that are changed
        set({ _i: false, _r: options.forceRevalidate })
      } else {
        // Calling `mutate()`, we revalidate all pages
        set({ _i: true, _r: options.forceRevalidate })
      }
    }

    return arguments.length
      ? swr.mutate(data, { ...options, forceRevalidate: shouldRevalidate })
      : swr.mutate()
  }

  const setSize = (arg: number | ((size: number) => number)) => {
    if (!infiniteKey.value) return EMPTY_PROMISE

    const [, changeSize] = createCacheHelper<
      Data,
      SWRInfiniteCacheValue<Data, any>
    >(cache, infiniteKey)

    let size
    if (isFunction(arg)) {
      size = arg(resolvePageSize())
    } else if (typeof arg == 'number') {
      size = arg
    }
    if (typeof size != 'number') return EMPTY_PROMISE

    changeSize({ _l: size })
    lastPageSizeRef.value = size

    // Calculate the page data after the size change.
    const data: Data[] = []
    const [getInfiniteCache] = createCacheHelper<
      Data,
      SWRInfiniteCacheValue<Data[], any>
    >(cache, infiniteKey)

    let previousPageData: any = null
    for (let i = 0; i < size; ++i) {
      const pageKey = serialize(getKey(i, previousPageData))
      const [getCache] = createCacheHelper<
        Data,
        SWRInfiniteCacheValue<Data, any>
      >(cache, pageKey)
      // Get the cached page data.
      const pageData = pageKey ? getCache()?.data?.data : UNDEFINED

      // Call `mutate` with infinte cache data if we can't get it from the page cache.
      if (isUndefined(pageData)) {
        return mutate(getInfiniteCache()?.data?.data as any)
      }

      data.push(pageData)
      previousPageData = pageData
    }

    return mutate(data as any)
  }

  return {
    size: resolvePageSize(),
    mutate,
    setSize,
    get data() {
      return swr.data
    },
    get error() {
      return swr.error
    },
    get isValidating() {
      return swr.isValidating
    },
    get isLoading() {
      return swr.isLoading
    },
  }
}

export default withArgs<SWRInfiniteHook>(useSWRInfinite)
