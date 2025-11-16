import SWRVCache from '../cache'
import { SWRGlobalState } from '../global-state'

export const initCache = <Data = any>(
  provider: SWRVCache<Data>
) => {
  if (!SWRGlobalState.get(provider)) {
    const setter = (key: string, value: any, ttl?: number) => {
      provider.set(key, value, ttl)
    }

    const initProvider = () => {
      if (!SWRGlobalState.has(provider)) {
        SWRGlobalState.set(provider, [
          Object.create(null),
          setter,
        ])
      }
    }

    initProvider()
  }

  return provider
}
