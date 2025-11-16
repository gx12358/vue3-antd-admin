import { requestClient } from '@/services/base'

export function getBasicCount<T = any, R = undefined>() {
  return requestClient.get<T, R>('/basic/list/count', {
    isMock: true
  })
}

export function getBasicList<T = any, R = undefined>(params) {
  return requestClient.get<T, R>('/basic/list', {
    params,
    isMock: true
  })
}

export function getBasicListDetails<T = any, R = undefined>(params) {
  return requestClient.get<T, R>('/basic/list/details', {
    params,
    isMock: true
  })
}

export function basicListOperate<T = any, R = undefined>(data) {
  return requestClient.post<T, R>(`/basic/list/${data?.id ? 'update' : 'add'}`, {
    data,
    isMock: true
  })
}

export function deleteBasicList<T = any, R = undefined>(params) {
  return requestClient.delete<T, R>('/basic/list/delete', {
    params,
    isMock: true
  })
}
