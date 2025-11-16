import type { SWRInfiniteKeyLoader } from '../utils'
import { INFINITE_PREFIX, serialize } from '../utils'

export const getFirstPageKey = (getKey: SWRInfiniteKeyLoader) => {
  return serialize(getKey ? getKey(0, null) : null)
}

export const unstable_serialize = (getKey: SWRInfiniteKeyLoader) => {
  return INFINITE_PREFIX + getFirstPageKey(getKey)
}
