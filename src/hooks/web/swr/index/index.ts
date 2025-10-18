import SwrConfigProvider, { useSwrConfig } from '../context'
import useSWRInfinite from '../infinite'
import { SWRVCache } from '../utils'
import useSWR, { mutate } from './use-swr'

export * from '../utils/types'
export { mutate, SwrConfigProvider, SWRVCache, useSwrConfig, useSWRInfinite }
export default useSWR
