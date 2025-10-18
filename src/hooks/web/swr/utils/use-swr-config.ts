import type { IConfig } from './types'
import { useSwrConfig } from '../context'
import { defaultConfig } from './config'
import { mergeObjects } from './shared'

export const useSWRConfig = (): IConfig => {
  const parentConfig = useSwrConfig()
  return mergeObjects(defaultConfig, parentConfig)
}
