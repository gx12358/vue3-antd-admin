import { requestClient } from '@/services/base'

export * from './basic'
export * from './card'
export * from './rules'

export function getArticleList<T = any, R = undefined>(data) {
  return requestClient.post<T, R>('/article/list', {
    data,
    isMock: true
  })
}
