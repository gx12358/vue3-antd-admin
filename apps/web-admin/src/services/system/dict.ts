import { requestClient } from '@/services/base'

// 查询字典数据详细
export function getDicts<T>(params) {
  return requestClient.get<T>('/system/dict-data/page', {
    params
  })
}
