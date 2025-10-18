import type { IKey } from './types'
import hash from './hash'

export function serialize(key: IKey): string {
  if (typeof key === 'function') {
    try {
      key = key()
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (err) {
      // dependencies not ready
      key = ''
    }
  }

  // If key is not falsy, or not an empty array, hash it.
  key
    = typeof key == 'string'
    ? key
    : (Array.isArray(key) ? key.length : key)
      ? hash(key)
      : ''

  return key
}
