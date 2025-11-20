import { requestClient } from '@/services/base'

export function getList<T>(params) {
  return requestClient.get<T>('/demo/table/list', {
    params
  })
}
