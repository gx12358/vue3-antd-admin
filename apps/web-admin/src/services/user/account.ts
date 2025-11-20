import { requestClient } from '@/services/base'

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
