import request from '@/utils/request'

export function getRouters<T = any, R = undefined>() {
  return request<T, R>({
    url: `/menu/navigate`,
    method: 'post',
    isMock: true
  })
}
