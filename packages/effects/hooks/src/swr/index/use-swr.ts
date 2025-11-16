import type { fetcherFn, IConfig, IKey, IResponse, revalidateOptions, State, SWRHook } from '../utils'
import { isServer } from '@gx-design-vue/pro-utils'
import {
  computed,
  isRef,
  onMounted,
  onUnmounted,
  reactive,
  toRefs,
  watch
} from 'vue'
import { createCacheHelper, serialize, SWRGlobalState, SWRVCache, withArgs } from '../utils'

interface StateRef<Data, Error> {
  data: Data, error: Error, isValidating: boolean, isLoading: boolean, revalidate: Fn, key: any
}

const REF_CACHE = new SWRVCache<StateRef<any, any>[]>()
const PROMISES_CACHE = new SWRVCache<State>()

/**
 * Cache the refs for later revalidation
 */
function setRefCache(key: string, theRef: StateRef<any, any>, ttl: number) {
  const refCacheItem = REF_CACHE.get(key)
  if (refCacheItem) {
    refCacheItem.data.push(theRef)
  } else {
    // #51 ensures ref cache does not evict too soon
    const gracePeriod = 5000
    REF_CACHE.set(key, [theRef], ttl > 0 ? ttl + gracePeriod : ttl)
  }
}

function onErrorRetry(revalidate: (any, opts: revalidateOptions) => void, errorRetryCount: number, config: IConfig): void {
  if (!config.isDocumentVisible?.()) {
    return
  }

  if (config.errorRetryCount !== undefined && errorRetryCount > config.errorRetryCount) {
    return
  }

  const count = Math.min(errorRetryCount || 0, config.errorRetryCount || 0)
  const timeout = count * (config.errorRetryInterval as number)
  setTimeout(() => {
    revalidate(null, { errorRetryCount: count + 1, shouldRetryOnError: true })
  }, timeout)
}

/**
 * Main mutation function for receiving data from promises to change state and
 * set data cache
 */
const mutate = async <Data>(key: string, res: Promise<Data> | Data, setCatch: any, ttl?: number) => {
  let data, error, isValidating

  if (isPromise(res)) {
    try {
      data = await res
    } catch (err) {
      error = err
    }
  } else {
    data = res
  }

  // eslint-disable-next-line prefer-const
  isValidating = false

  const newData = { data, error, isValidating }
  if (typeof data !== 'undefined') {
    try {
      setCatch(newData, ttl)
    } catch (err) {
      console.error('swrv(mutate): failed to set cache', err)
    }
  }

  /**
   * Revalidate all swrv instances with new data
   */
  const stateRef = REF_CACHE.get(key)
  if (stateRef && stateRef.data.length) {
    // This filter fixes #24 race conditions to only update ref data of current
    // key, while data cache will continue to be updated if revalidation is
    // fired
    let refs = stateRef.data.filter(r => r.key === key)

    refs.forEach((r, idx) => {
      if (typeof newData.data !== 'undefined') {
        r.data = newData.data
      }
      r.error = newData.error
      r.isValidating = newData.isValidating
      r.isLoading = newData.isValidating

      const isLast = idx === refs.length - 1
      if (!isLast) {
        // Clean up refs that belonged to old keys
        delete refs[idx]
      }
    })

    refs = refs.filter(Boolean)
  }

  return newData
}

function useSWRV<Data = any, Error = any>(
  _key: IKey,
  fn: fetcherFn<Data> | null,
  config: IConfig
): IResponse<Data, Error> {
  let unmounted = false
  let isHydrated = false

  const IS_SERVER = isServer

  const [FETCH] = SWRGlobalState.get(config.cache as any)

  // #region ssr
  /**
   const isSsrHydration = Boolean(
   \!IS_SERVER &&
   vm.$vnode &&
   vm.$vnode.elm &&
   vm.$vnode.elm.dataset &&
   vm.$vnode.elm.dataset.swrvKey)
   */
    // #endregion

  const ttl = IS_SERVER ? config.serverTTL : config.ttl
  const key = computed(() => {
    return serialize(isRef(_key) ? _key.value : _key)
  })

  const [getCache, setCache] = createCacheHelper<
    Data,
    State<Data, any> & {
    // The original key arguments.
    _k?: IKey
  }
  >(config.cache as any, key)

  // @ts-ignore
  let stateRef = null as StateRef<Data, Error>

  // #region ssr
  // if (isSsrHydration) {
  //   // component was ssrHydrated, so make the ssr reactive as the initial data
  //   const swrvState = (window as any).__SWRV_STATE__ ||
  //     ((window as any).__NUXT__ && (window as any).__NUXT__.swrv) || []
  //   const swrvKey = +(vm as any).$vnode.elm.dataset.swrvKey

  //   if (swrvKey !== undefined && swrvKey !== null) {
  //     const nodeState = swrvState[swrvKey] || []
  //     const instanceState = nodeState[isRef(keyRef) ? keyRef.value : keyRef()]

  //     if (instanceState) {
  //       stateRef = reactive(instanceState)
  //       isHydrated = true
  //     }
  //   }
  // }
  // #endregion

  if (!stateRef) {
    stateRef = reactive({
      data: undefined,
      error: undefined,
      isValidating: true,
      isLoading: true,
      key: null
    }) as StateRef<Data, Error>
  }

  /**
   * Revalidate the cache, mutate data
   */
  const revalidate = async (data?: fetcherFn<Data>, opts?: revalidateOptions) => {
    const isFirstFetch = stateRef.data === undefined
    const keyVal = key.value
    if (!keyVal) return

    const cacheItem = getCache()
    const newData = cacheItem && cacheItem.data
    stateRef.isValidating = true
    stateRef.isLoading = !newData
    if (newData) {
      stateRef.data = newData.data as any
      stateRef.error = newData.error
    }

    const fetcher = data || fn
    if (
      !fetcher
      || (!config.isDocumentVisible?.() && !isFirstFetch)
      || (opts?.forceRevalidate !== undefined && !opts?.forceRevalidate)
    ) {
      stateRef.isValidating = false
      stateRef.isLoading = false
      return
    }

    // Dedupe items that were created in the last interval #76
    if (cacheItem) {
      let shouldRevalidate = !FETCH[key.value]

      if (!shouldRevalidate) {
        const [createdAt] = FETCH[key.value]
        shouldRevalidate = Boolean(
          ((Date.now() - createdAt) >= (config.dedupingInterval as number)) || opts?.forceRevalidate
        )
      }

      if (!shouldRevalidate) {
        stateRef.isValidating = false
        stateRef.isLoading = false
        return
      }
    }

    const trigger = async () => {
      const promiseFromCache = PROMISES_CACHE.get(keyVal)

      if (!promiseFromCache) {
        const fetcherArgs = Array.isArray(keyVal) ? keyVal : [keyVal]
        const newPromise = fetcher(...fetcherArgs)
        PROMISES_CACHE.set(keyVal, newPromise, config?.dedupingInterval as any)
        await mutate(keyVal, newPromise, setCache, ttl)
        FETCH[key.value] = [
          Date.now()
        ]
      } else {
        await mutate(keyVal, promiseFromCache.data, setCache, ttl)
        FETCH[key.value] = [
          Date.now()
        ]
      }

      stateRef.isValidating = false
      stateRef.isLoading = false
      PROMISES_CACHE.delete(keyVal)
      if (stateRef.error !== undefined) {
        const shouldRetryOnError = !unmounted && config.shouldRetryOnError && (opts ? opts.shouldRetryOnError : true)
        if (shouldRetryOnError) {
          onErrorRetry(revalidate, opts ? opts.errorRetryCount as number : 1, config)
        }
      }
    }

    if (newData && config.revalidateDebounce) {
      setTimeout(async () => {
        if (!unmounted) {
          await trigger()
        }
      }, config.revalidateDebounce)
    } else {
      await trigger()
    }
  }

  const revalidateCall = async () => revalidate(null as any, { shouldRetryOnError: false })
  let timer: any = null
  /**
   * Setup polling
   */
  onMounted(() => {
    const tick = async () => {
      // component might un-mount during revalidate, so do not set a new timeout
      // if this is the case, but continue to revalidate since promises can't
      // be cancelled and new hook instances might rely on promise/data cache or
      // from pre-fetch
      if (!stateRef.error && config?.isOnline?.()) {
        // if API request errored, we stop polling in this round
        // and let the error retry function handle it
        await revalidate()
      } else {
        if (timer) {
          clearTimeout(timer)
        }
      }
      if (config.refreshInterval && !unmounted) {
        timer = setTimeout(tick, config.refreshInterval)
      }
    }
    if (config.refreshInterval) {
      timer = setTimeout(tick, config.refreshInterval)
    }
    if (config.revalidateOnFocus) {
      document.addEventListener('visibilitychange', revalidateCall, false)
      window.addEventListener('focus', revalidateCall, false)
    }
  })

  /**
   * Teardown
   */
  onUnmounted(() => {
    unmounted = true
    if (timer) {
      clearTimeout(timer)
    }
    if (config.revalidateOnFocus) {
      document.removeEventListener('visibilitychange', revalidateCall, false)
      window.removeEventListener('focus', revalidateCall, false)
    }
    const refCacheItem = REF_CACHE.get(key.value)
    if (refCacheItem) {
      refCacheItem.data = refCacheItem.data.filter(ref => ref !== stateRef)
    }
  })

  // #region ssr
  // if (IS_SERVER) {
  //   // make sure srwv exists in ssrContext
  //   let swrvRes = []
  //   if (vm.$ssrContext) {
  //     swrvRes = vm.$ssrContext.swrv = vm.$ssrContext.swrv || swrvRes
  //   }

  //   const ssrKey = swrvRes.length
  //   if (!vm.$vnode || (vm.$node && !vm.$node.data)) {
  //     vm.$vnode = {
  //       data: { attrs: { 'data-swrv-key': ssrKey } }
  //     }
  //   }

  //   const attrs = (vm.$vnode.data.attrs = vm.$vnode.data.attrs || {})
  //   attrs['data-swrv-key'] = ssrKey

  //   // Nuxt compatibility
  //   if (vm.$ssrContext && vm.$ssrContext.nuxt) {
  //     vm.$ssrContext.nuxt.swrv = swrvRes
  //   }

  //   onServerPrefetch(async () => {
  //     await revalidate()

  //     if (!swrvRes[ssrKey]) swrvRes[ssrKey] = {}

  //     swrvRes[ssrKey][keyRef.value] = {
  //       data: stateRef.data,
  //       error: stateRef.error,
  //       isValidating: stateRef.isValidating
  //     }
  //   })
  // }
  // #endregion

  /**
   * Revalidate when key dependencies change
   */
  try {
    watch(key, (val) => {
      stateRef.key = val
      stateRef.isValidating = Boolean(val)
      setRefCache(val, stateRef, ttl as number)

      if (!IS_SERVER && !isHydrated && val) {
        revalidate()
      }
      isHydrated = false
    }, {
      immediate: true
    })
  } catch {
    // do nothing
  }

  const res: IResponse = {
    ...toRefs(stateRef),
    mutate: (data?, opts?: revalidateOptions) => revalidate(data, {
      ...opts,
      forceRevalidate: true
    })
  }

  return res
}

function isPromise<T>(p: any): p is Promise<T> {
  return p !== null && typeof p === 'object' && typeof p.then === 'function'
}

export { mutate }

export default withArgs<SWRHook>(useSWRV)
