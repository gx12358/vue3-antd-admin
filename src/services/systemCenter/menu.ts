import request from '@/utils/request'

export function getMenuList<T = any, R = undefined>() {
  return request<T, R>({
    url: `/menu/navigate`,
    method: 'post',
    isMock: true
  })
}
