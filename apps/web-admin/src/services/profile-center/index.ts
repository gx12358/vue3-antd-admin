import { requestClient } from '@/services/base'

export function getBasic() {
  return requestClient.get('/profile/basic', {
    isMock: true
  })
}

export function getBasicTable() {
  return requestClient.get('/profile/basic/details', {
    isMock: true
  })
}

export function getAdvanced() {
  return requestClient.get('/profile/advanced', {
    isMock: true
  })
}

export function getAdvancedTable1<T = any, R = undefined>(params) {
  return requestClient.get<T, R>('/profile/advanced/table1', {
    isMock: true,
    params
  })
}

export function getAdvancedTable2<T = any, R = undefined>(params) {
  return requestClient.get<T, R>('/profile/advanced/table2', {
    isMock: true,
    params
  })
}

export function getAdvancedTable3<T = any, R = undefined>(params) {
  return requestClient.get<T, R>('/profile/advanced/table3', {
    isMock: true,
    params
  })
}
