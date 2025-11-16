import { requestClient } from '@/services/base'

export function getAdvancedForm<T = any, R = undefined>(params) {
  return requestClient.get<T, R>('/form/advancedForm', {
    isMock: true,
    params
  })
}

export function getAdvancedFormTable<T = any, R = undefined>(data) {
  return requestClient.post<T, R>('/form/advancedFormTable', {
    isMock: true,
    data
  })
}

export function addAdvancedFormTable<T = any, R = undefined>(data) {
  return requestClient.post<T, R>('/form/advancedFormTable/add', {
    isMock: true,
    data
  })
}

export function updateAdvancedFormTable<T = any, R = undefined>(data) {
  return requestClient.post<T, R>('/form/advancedFormTable/update', {
    isMock: true,
    data
  })
}

export function deleteAdvancedFormTable<T = any, R = undefined>(data) {
  return requestClient.post<T, R>('/form/advancedFormTable/delete', {
    isMock: true,
    data
  })
}
