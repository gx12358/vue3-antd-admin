import type { Fetcher, IConfig, Key } from './types'
import { isFunction } from './shared'

export const normalize = <KeyType = Key, Data = any>(
  args:
    | [KeyType]
    | [KeyType, Fetcher<Data> | null]
    | [KeyType, IConfig | undefined]
    | [KeyType, Fetcher<Data> | null, IConfig | undefined]
): [KeyType, Fetcher<Data> | null, Partial<IConfig<Data>>] => {
  return isFunction(args[1])
    ? [args[0], args[1], args[2] || {}]
    : [args[0], null, (args[1] === null ? args[2] : args[1]) || {}]
}
