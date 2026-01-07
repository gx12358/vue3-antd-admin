import type { PageResult } from '@gx/types'
import { requestClient } from '@/services/base'

// 查询字典数据（精简)列表
export function getSimpleDictDataList() {
  return requestClient.get<DictRecord[]>(
    '/system/dict-data/simple-list'
  )
}

// 查询字典数据列表
export function getDictDataPage<T = PageResult<DictRecord>>(params) {
  return requestClient.get<T>(
    '/system/dict-data/page',
    { params }
  )
}

// 查询字典数据详情
export function getDictData<T = DictRecord>(id: number) {
  return requestClient.get<T>(
    `/system/dict-data/get?id=${id}`
  )
}

// 新增字典数据
export function createDictData(data: DictRecord) {
  return requestClient.post('/system/dict-data/create', { data })
}

// 修改字典数据
export function updateDictData(data: DictRecord) {
  return requestClient.put('/system/dict-data/update', { data })
}

// 删除字典数据
export function deleteDictData(params) {
  return requestClient.delete(`/system/dict-data/delete`, { params })
}

// 批量删除字典数据
export function deleteDictDataList(params) {
  return requestClient.delete(
    `/system/dict-data/delete-list`, { params }
  )
}

// 导出字典类型数据
export function exportDictData(params: any) {
  return requestClient.get('/system/dict-data/export-excel', { params, download: true })
}
