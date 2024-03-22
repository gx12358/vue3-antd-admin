import request from '@/utils/request'

export function getCardList<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/card/list',
    method: 'get',
    params,
    isMock: true
  })
}

export function getCardListDetails<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/card/list/details',
    method: 'get',
    params,
    isMock: true
  })
}

export function cardListOperate<T = any, R = undefined>(data) {
  return request<T, R>({
    url: `/card/list/${data?.id ? 'update' : 'add'}`,
    method: 'post',
    data,
    isMock: true
  })
}

export function deleteCardList<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/card/list/delete',
    method: 'delete',
    params,
    isMock: true
  })
}
