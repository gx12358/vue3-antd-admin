import type { IConfig, State } from './types'
import SWRVCache from './cache'
import { initCache } from './cache/initCache'
import webPreset from './web-preset'

const cache = initCache<State>(new SWRVCache<State>())

export { cache }

export const defaultConfig: IConfig = {
  cache: cache as any,
  refreshInterval: 0,
  ttl: 0,
  serverTTL: 1000,
  dedupingInterval: 2000,
  revalidateOnFocus: true,
  revalidateDebounce: 0,
  shouldRetryOnError: true,
  errorRetryInterval: 5000,
  errorRetryCount: 5,
  fetcher: webPreset.fetcher,
  isOnline: webPreset.isOnline,
  isDocumentVisible: webPreset.isDocumentVisible
}
