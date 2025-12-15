import base from './base'
import number from './number'

export const rules = (extra: any[] = []) => {
  return [
    ...base,
    ...number,
    ...extra
  ]
}
