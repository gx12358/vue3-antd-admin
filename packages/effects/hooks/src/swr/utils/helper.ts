import type { MaybeRef } from 'vue'
import type { ICacheItem } from './cache'
import type { State } from './types'
import { isRef } from 'vue'
import SWRVCache from './cache'
import { SWRGlobalState } from './global-state'
import { isUndefined, mergeObjects } from './shared'

const EMPTY_CACHE = {}
const INITIAL_CACHE: Record<string, any> = {}

const STR_UNDEFINED = 'undefined'

// NOTE: Use the function to guarantee it's re-evaluated between jsdom and node runtime for tests.
export const isWindowDefined = typeof window != STR_UNDEFINED
export const isDocumentDefined = typeof document != STR_UNDEFINED
export const isLegacyDeno = isWindowDefined && 'Deno' in window

export const hasRequestAnimationFrame = () =>
  isWindowDefined && typeof window['requestAnimationFrame'] != STR_UNDEFINED

export const createCacheHelper = <Data = any, T = State<Data, any>>(
  cache: SWRVCache<State>,
  _key: MaybeRef<string | undefined>
) => {
  const key: any = () => {
    return _key ? isRef(_key) ? _key.value : _key : undefined
  }

  const state = SWRGlobalState.get(cache) as any
  return [
    // Getter
    () => (isUndefined(key()) ? undefined : cache.get(key()) as ICacheItem<T> | undefined),
    // Setter
    (info: T, ttl?: number) => {
      if (!isUndefined(key())) {
        const prev = cache.get(key())?.data

        // Before writing to the store, we keep the value in the initial cache
        // if it's not there yet.
        if (!(key() in INITIAL_CACHE)) {
          INITIAL_CACHE[key()] = prev
        }

        state[1](key(), mergeObjects(prev, info), ttl)
      }
    },
    // Get server cache snapshot
    () => {
      if (!isUndefined(key())) {
        // If the cache was updated on the client, we return the stored initial value.
        if (key() in INITIAL_CACHE) return INITIAL_CACHE[key()]
      }

      // If we haven't done any client-side updates, we return the current value.
      return ((!isUndefined(key()) && cache.get(key())) || EMPTY_CACHE) as T
    }
  ] as const
}

// export { UNDEFINED, OBJECT, isUndefined, isFunction, mergeObjects, isPromiseLike }
