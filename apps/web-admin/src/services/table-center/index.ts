import type { RequestOptions } from '@gx/request'
import { requestClient } from '@/services/base'

export function getTableList<T = any, R = undefined>(data, config: Partial<RequestOptions> = {}) {
  return requestClient.post<T, R>('/table/list', {
    isMock: true,
    data,
    ...config
  })
}

export function doDelete<T = any, R = undefined>(params) {
  return requestClient.delete<T, R>('/table/delete', {
    isMock: true,
    params
  })
}
