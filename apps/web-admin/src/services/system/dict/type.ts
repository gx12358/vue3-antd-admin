import type { PageResult } from '@gx/types'
import type * as SystemDictTypeApi from './typing'
import { requestClient } from '@/services/base'

export type {
  SystemDictTypeApi
}

// 查询字典（精简)列表
export function getSimpleDictTypeList() {
  return requestClient.get<SystemDictTypeApi.DictTypeTableRecord[]>(
    '/system/dict-type/list-all-simple',
  )
}

// 查询字典列表
export function getDictTypePage<T = PageResult<SystemDictTypeApi.DictTypeTableRecord>>(params) {
  return requestClient.get<T>(
    '/system/dict-type/page',
    { params },
  )
}

// 查询字典详情
export function getDictType(id: number) {
  return requestClient.get<SystemDictTypeApi.UpdateDictTypeTableRecord>(
    `/system/dict-type/get?id=${id}`,
  )
}

// 新增字典
export function createDictType(data: SystemDictTypeApi.UpdateDictTypeTableRecord) {
  return requestClient.post('/system/dict-type/create', {
    data
  })
}

// 修改字典
export function updateDictType(data: SystemDictTypeApi.UpdateDictTypeTableRecord) {
  return requestClient.put('/system/dict-type/update', {
    data
  })
}

// 删除字典
export function deleteDictType(params) {
  return requestClient.delete(`/system/dict-type/delete`, { params })
}

// 批量删除字典
export function deleteDictTypeList(params) {
  return requestClient.delete(
    `/system/dict-type/delete-list`, { params }
  )
}

// 导出字典类型
export function exportDictType(params: any) {
  return requestClient.get('/system/dict-type/export-excel', {
    params,
    download: true
  })
}
