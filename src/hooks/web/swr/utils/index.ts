import type { ICacheItem } from './cache'
import SWRVCache from './cache'
import { INFINITE_PREFIX } from './constants'
import hash from './hash'
import webPreset from './web-preset'

export { hash, INFINITE_PREFIX, SWRVCache, webPreset }

export { cache, defaultConfig } from './config'
export { initCache } from './cache/initCache'
export { SWRGlobalState } from './global-state'
export { mergeConfigs } from './merge-config'
export { normalize } from './normalize-args'
export { withArgs } from './resolve-args'
export { useSWRConfig } from './use-swr-config'
export { serialize } from './serialize'
export * from './shared'
export * from './helper'

export type {
  ICacheItem
}

export * from './types'
