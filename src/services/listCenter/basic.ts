import request from '@/utils/request'

export function getBasicCount<T = any, R = undefined>() {
  return request<T, R>({
    url: '/basic/list/count',
    method: 'get',
    isMock: true
  })
}

export function getBasicList<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/basic/list',
    method: 'get',
    params,
    isMock: true
  })
}

export function getBasicListDetails<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/basic/list/details',
    method: 'get',
    params,
    isMock: true
  })
}

export function basicListOperate<T = any, R = undefined>(data) {
  return request<T, R>({
    url: `/basic/list/${data?.id ? 'update' : 'add'}`,
    method: 'post',
    data,
    isMock: true
  })
}

export function deleteBasicList<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/basic/list/delete',
    method: 'delete',
    params,
    isMock: true
  })
}
