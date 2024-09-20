import request from '@/utils/request'

export * from './basic'
export * from './card'
export * from './rules'

export function getArticleList<T = any, R = undefined>(data) {
  return request<T, R>({
    url: '/article/list',
    method: 'post',
    data,
    isMock: true
  })
}
