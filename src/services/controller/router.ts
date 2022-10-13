import request from '@/utils/request'
import { stringify } from 'qs'

export function getRouterList(params?: any) {
  return request({
    url: `/menu/navigate?${stringify(params)}`,
    method: 'post',
    isMock: true
  })
}
