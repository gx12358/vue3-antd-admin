import type { RequestOptions } from '@gx/request'
import { requestClient } from '@/services/base'

export type FomeType = 'step' | 'advanced'

export function getForm<T = any>(params, options = {} as RequestOptions) {
  return requestClient.get<T>('/demo/form/get', {
    params,
    ...options,
  })
}

export function createForm<T = any>(data, options = {} as RequestOptions) {
  return requestClient.post<T>('/demo/form/create', {
    data,
    ...options,
  })
}

export function updateForm<T = any>(data, options = {} as RequestOptions) {
  return requestClient.post<T>('/demo/form/update', {
    data,
    ...options,
  })
}
