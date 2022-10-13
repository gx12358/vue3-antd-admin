import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/getList',
    method: 'get',
    isMock: true,
    params
  })
}

export function doEdit(data) {
  return request({
    url: '/table/doEdit',
    method: 'post',
    isMock: true,
    data
  })
}

export function doDelete(data) {
  return request({
    url: '/table/doDelete',
    method: 'post',
    isMock: true,
    data
  })
}
