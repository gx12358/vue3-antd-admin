import { requestClient } from '@/services/base'

// 查询字典数据详细
export function getDicts(dictCode) {
  return requestClient.get('/dict/data/type/' + dictCode, {
    isMock: true
  })
}
