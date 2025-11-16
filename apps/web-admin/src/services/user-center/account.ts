import { requestClient } from '@/services/base'

export function getUserInfo<T, D = undefined>() {
  return requestClient.get<T, D>('/user/queryUserDetail', {
    isMock: true
  })
}

export function getUserList() {
  return requestClient.get('/user/account/list', {
    isMock: true
  })
}

export function getAccountGroupList() {
  return requestClient.get('/user/account/group', {
    isMock: true
  })
}

export function getAccountCount() {
  return requestClient.get('/user/account/count', {
    isMock: true
  })
}

export function updateUserDetails(data) {
  return requestClient.post('/user/account/update', {
    isMock: true,
    data
  })
}
