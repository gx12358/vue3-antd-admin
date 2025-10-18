import type { IConfig } from './types'
import { mergeObjects } from './shared'

export const mergeConfigs = (
  a: Partial<IConfig>,
  b?: Partial<IConfig>
) => {
  // Need to create a new object to avoid mutating the original here.
  const v: Partial<IConfig> = mergeObjects(a, b)

  return v
}
