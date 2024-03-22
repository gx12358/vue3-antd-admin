import request from '@/utils/request'

export function getRulesList<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/rule/list',
    method: 'post',
    data,
    isMock: true
  })
}

export function addRules<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/rule/add',
    method: 'post',
    data,
    isMock: true
  })
}

export function updateRules<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/rule/update',
    method: 'post',
    data,
    isMock: true
  })
}

export function deleteRules<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/rule/delete',
    method: 'post',
    data,
    isMock: true
  })
}
