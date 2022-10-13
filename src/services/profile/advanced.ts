import request from '@/utils/request'

export function queryAdvancedProfile() {
  return request({
    url: '/profile/advanced',
    method: 'post',
    isMock: true
  })
}
