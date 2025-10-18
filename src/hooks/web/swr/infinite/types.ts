import type { Ref } from 'vue'
import type { Arguments, fetcherFn, IConfig, IKey, revalidateOptions, State } from '../utils'
import SWRVCache from '../utils/cache'

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
