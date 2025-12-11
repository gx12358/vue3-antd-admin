import type { Fn } from '@gx/types'
import type { Ref, WatchSource } from 'vue'
import SWRVCache from './cache'
import LocalStorageCache from './cache/adapters/localStorage'

export type fetcherFn<Data> = (...args: any) => Data | Promise<Data>

export interface IConfig<
  Data = any,
  Fn extends fetcherFn<Data> = fetcherFn<Data>
> {
  refreshInterval?: number
  cache?: LocalStorageCache | SWRVCache<any>
  dedupingInterval?: number
  ttl?: number
  serverTTL?: number
  revalidateOnFocus?: boolean
  revalidateDebounce?: number
  shouldRetryOnError?: boolean
  errorRetryInterval?: number
  errorRetryCount?: number
  fetcher?: Fn,
  isOnline?: () => boolean
  isDocumentVisible?: () => boolean
}

export interface revalidateOptions {
  shouldRetryOnError?: boolean,
  errorRetryCount?: number,
  forceRevalidate?: boolean,
}

export interface State<Data = any, Error = any> {
  key?: any
  data?: Data
  error?: Error
  revalidate?: Fn
  isValidating?: boolean
  isLoading?: boolean
}

export interface BaseResponse<Data = any, Error = any> {
  key: any
  data: Ref<Data | undefined>
  error: Ref<Error | undefined>
  isValidating: Ref<boolean>
  isLoading: Ref<boolean>
}

export interface IResponse<Data = any, Error = any> extends BaseResponse<Data, Error> {
  mutate: (data?: fetcherFn<Data>, opts?: revalidateOptions) => Promise<void>
}

export type keyType = string | any[] | null | undefined

export type IKey = keyType | WatchSource<keyType>

export type ArgumentsTuple = readonly [any, ...unknown[]]

export type Arguments
  = | string
  | ArgumentsTuple
  | Record<any, any>
  | null
  | undefined
  | false

export type Key = Arguments | (() => Arguments)

export type FetcherResponse<Data = unknown> = Data | Promise<Data>

export type Fetcher<
  Data = unknown,
  SWRKey extends Key = Key
> = SWRKey extends () => infer Arg | null | undefined | false
  ? (arg: Arg) => FetcherResponse<Data>
  : SWRKey extends null | undefined | false
    ? never
    : SWRKey extends infer Arg
      ? (arg: Arg) => FetcherResponse<Data>
      : never

export interface SWRHook {
  <Data = any, Error = any>(
    key: IKey
  ): IResponse<Data, Error>
  <Data = any, Error = any>(
    key: IKey,
    fetcher: fetcherFn<Data> | null
  ): IResponse<Data, Error>
  <
    Data = any,
    Error = any,
  >(
    key: IKey,
    fetcher: fetcherFn<Data> | null,
    config: IConfig<Data>
  ): IResponse<Data, Error>
}

export interface SWRInfiniteHook {
  <Data = any, Error = any>(
    key: SWRInfiniteKeyLoader<Data>
  ): SWRInfiniteResponse<Data, Error>
  <Data = any, Error = any>(
    key: SWRInfiniteKeyLoader<Data>,
    fetcher: fetcherFn<Data> | null
  ): SWRInfiniteResponse<Data, Error>
  <
    Data = any,
    Error = any,
  >(
    key: SWRInfiniteKeyLoader<Data>,
    fetcher: fetcherFn<Data> | null,
    config: Partial<SWRInfiniteConfiguration<Data>>
  ): SWRInfiniteResponse<Data, Error>
}

export type SWRInfiniteKeyLoader<Data = any> = (
  index: number,
  previousPageData: Data | null
) => IKey

export interface SWRInfiniteConfiguration<Data = any>
  extends Omit<IConfig<Data, fetcherFn<Data>>, 'cache'> {
  cache: SWRVCache<State>
  initialSize?: number
  revalidateAll?: boolean
  persistSize?: boolean
  revalidateOnMount?: boolean
  revalidateFirstPage?: boolean
}

interface SWRInfiniteRevalidateFn<Data = any> {
  (data: Data, key: Arguments): boolean
}

export interface SWRInfiniteCacheValue<Data = any, Error = any>
  extends State<Data, Error> {
  // We use cache to pass extra info (context) to fetcher so it can be globally
  // shared. The key of the context data is based on the first-page key.
  _i?: boolean
  // Page size is also cached to share the page data between hooks with the
  // same key.
  _l?: number
  // shoud revalidate
  _r?: boolean | SWRInfiniteRevalidateFn
  _k?: Arguments
}

export interface SWRInfiniteResponse<Data = any, Error = any> {
  data: Ref<Data[] | undefined>
  error: Ref<Error | undefined>
  setSize: (size: number | ((prev: number) => number)) => void
  isValidating: Ref<boolean>
  isLoading: Ref<boolean>
  mutate: (data?: fetcherFn<Data>, opts?: revalidateOptions) => Promise<any>
}
