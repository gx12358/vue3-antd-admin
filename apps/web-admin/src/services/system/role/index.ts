import type { PageResult } from '@gx/types/request'
import type * as SystemRoleApi from './typing'
import { requestClient } from '@/services/base'

export type {
  SystemRoleApi
}

/** 查询角色列表 */
export function getRolePage<T = PageResult<SystemRoleApi.RoleTableRecord>>(params) {
  return requestClient.get<T>(
    '/system/role/page',
    { params },
  )
}

/** 查询角色（精简)列表 */
export function getSimpleRoleList() {
  return requestClient.get<SystemRoleApi.RoleTableRecord[]>('/system/role/simple-list')
}

/** 查询角色详情 */
export function getRole(id: number) {
  return requestClient.get<SystemRoleApi.UpdateRoleTableRecord>(`/system/role/get?id=${id}`)
}

/** 新增角色 */
export function createRole(data: SystemRoleApi.UpdateRoleTableRecord) {
  return requestClient.post('/system/role/create', { data })
}

/** 修改角色 */
export function updateRole(data: SystemRoleApi.UpdateRoleTableRecord) {
  return requestClient.put('/system/role/update', { data })
}

/** 删除角色 */
export function deleteRole(params) {
  return requestClient.delete(`/system/role/delete`, { params })
}

/** 批量删除角色 */
export function deleteRoleList(params) {
  return requestClient.delete(`/system/role/delete-list`, { params })
}

/** 导出角色 */
export function exportRole(params: any) {
  return requestClient.get('/system/role/export-excel', {
    params,
    responseReturn: 'body',
    responseType: 'blob',
  })
}
