import { requestClient } from '@/services/base'

export function updateUserDetails(data) {
  return requestClient.post('/user/account/update', {
    isMock: true,
    data
  })
}
