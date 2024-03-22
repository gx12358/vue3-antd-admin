import request from '@/utils/request'

export function getBasic() {
  return request({
    url: '/profile/basic',
    method: 'get',
    isMock: true
  })
}

export function getBasicTable() {
  return request({
    url: '/profile/basic/details',
    method: 'get',
    isMock: true
  })
}

export function getAdvanced() {
  return request({
    url: '/profile/advanced',
    method: 'get',
    isMock: true
  })
}

export function getAdvancedTable1<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/profile/advanced/table1',
    method: 'get',
    isMock: true,
    params
  })
}

export function getAdvancedTable2<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/profile/advanced/table2',
    method: 'get',
    isMock: true,
    params
  })
}

export function getAdvancedTable3<T = any, R = undefined>(params) {
  return request<T, R>({
    url: '/profile/advanced/table3',
    method: 'get',
    isMock: true,
    params
  })
}
