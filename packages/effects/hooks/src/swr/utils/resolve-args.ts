import { mergeConfigs } from './merge-config'
import { normalize } from './normalize-args'
import { useSWRConfig } from './use-swr-config'

export const withArgs = <SWRType>(hook: any) => {
  return function useSWRArgs(...args: any) {
    const fallbackConfig = useSWRConfig()

    // Normalize arguments.
    const [key, fn, _config] = normalize<any, any>(args)

    // Merge configurations.
    const config = mergeConfigs(fallbackConfig, _config)

    // Apply middleware
    return hook(key, fn || config.fetcher || null, config)
  } as unknown as SWRType
}
