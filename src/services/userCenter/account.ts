import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/user/queryUserDetail',
    method: 'get',
    isMock: true
  })
}

export function getUserList() {
  return request({
    url: '/user/account/list',
    method: 'get',
    isMock: true
  })
}

export function getAccountGroupList() {
  return request({
    url: '/user/account/group',
    method: 'get',
    isMock: true
  })
}

export function getAccountCount() {
  return request({
    url: '/user/account/count',
    method: 'get',
    isMock: true
  })
}

export function updateUserDetails(data) {
  return request({
    url: '/user/account/update',
    method: 'post',
    data,
    isMock: true
  })
}
