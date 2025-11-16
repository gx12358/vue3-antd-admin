import { requestClient } from '@/services/base'

export function getRulesList<T = any, R = undefined>(data) {
  return requestClient.post<T, R>('/rule/list', {
    data,
    isMock: true
  })
}

export function addRules<T = any, R = undefined>(data) {
  return requestClient.post<T, R>('/rule/add', {
    data,
    isMock: true
  })
}

export function updateRules<T = any, R = undefined>(data) {
  return requestClient.post<T, R>('/rule/update', {
    data,
    isMock: true
  })
}

export function deleteRules<T = any, R = undefined>(data) {
  return requestClient.post<T, R>('/rule/delete', {
    data,
    isMock: true
  })
}
