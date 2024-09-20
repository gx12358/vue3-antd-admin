import type { GAxiosOptions } from '@/utils/request/typings'
import request from '@/utils/request'

export function getTableList<T = any, R = undefined>(data, config: Partial<GAxiosOptions> = {}) {
  return request<T, R>({
    url: '/table/list',
    method: 'post',
    isMock: true,
    data,
    ...config
  })
}

export function doDelete<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/table/delete',
    method: 'get',
    isMock: true,
    params
  })
}
