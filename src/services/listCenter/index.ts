import request from '@/utils/request'

export * from './rules'
export * from './basic'
export * from './card'

export function getArticleList<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/article/list',
    method: 'post',
    data,
    isMock: true
  })
}
