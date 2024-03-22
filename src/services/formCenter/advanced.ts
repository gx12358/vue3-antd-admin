import request from '@/utils/request'

export function getAdvancedForm<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/form/advancedForm',
    method: 'get',
    isMock: true,
    params
  })
}

export function getAdvancedFormTable<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/form/advancedFormTable',
    method: 'post',
    isMock: true,
    data
  })
}

export function addAdvancedFormTable<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/form/advancedFormTable/add',
    method: 'post',
    isMock: true,
    data
  })
}

export function updateAdvancedFormTable<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/form/advancedFormTable/update',
    method: 'post',
    isMock: true,
    data
  })
}

export function deleteAdvancedFormTable<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/form/advancedFormTable/delete',
    method: 'post',
    isMock: true,
    data
  })
}
