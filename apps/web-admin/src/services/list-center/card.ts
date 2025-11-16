import { requestClient } from '@/services/base'

export function getCardList<T = any, R = undefined>(params) {
  return requestClient.get<T, R>('/card/list', {
    params,
    isMock: true
  })
}

export function getCardListDetails<T = any, R = undefined>(params) {
  return requestClient.get<T, R>('/card/list/details', {
    params,
    isMock: true
  })
}

export function cardListOperate<T = any, R = undefined>(data) {
  return requestClient.post<T, R>(`/card/list/${data?.id ? 'update' : 'add'}`, {
    method: 'post',
    data,
    isMock: true
  })
}

export function deleteCardList<T = any, R = undefined>(params) {
  return requestClient.delete<T, R>('/card/list/delete', {
    params,
    isMock: true
  })
}
