import type { RequestOptions } from '@gx/request'
import type * as SystemUserApi from './typing'
import { requestClient } from '@/services/base'

export type {
  SystemUserApi
}

export function getUserPage<T = any>(params, options = {} as RequestOptions) {
  return requestClient.get<T>('/system/user/page', {
    params,
    ...options
  })
}

/** 查询用户详情 */
export function getUser(id: number) {
  return requestClient.get<SystemUserApi.UserTableRecord>(`/system/user/get?id=${id}`)
}

/** 新增用户 */
export function createUser(data: SystemUserApi.UpdateUserTableRecord) {
  return requestClient.post('/system/user/create', { data })
}

/** 修改用户 */
export function updateUser(data: SystemUserApi.UpdateUserTableRecord) {
  return requestClient.put('/system/user/update', { data })
}

/** 删除用户 */
export function deleteUser(params) {
  return requestClient.delete(`/system/user/delete`, { params })
}

/** 用户状态修改 */
export function updateUserStatus(params) {
  return requestClient.put('/system/user/update-status', {
    params
  })
}

/** 批量删除用户 */
export function deleteUserList(params) {
  return requestClient.delete(`/system/user/delete-list`, {
    params
  })
}

/** 导出用户 */
export function exportUser(params: any) {
  return requestClient.get('/system/user/export-excel', {
    params,
    download: true
  })
}

/** 下载用户导入模板 */
export function importUserTemplate() {
  return requestClient.get('/system/user/get-import-template', {
    download: true
  })
}

/** 导入用户 */
export function importUser(data) {
  return requestClient.post('/system/user/import', {
    data,
    uploader: true,
  })
}

/** 用户密码重置 */
export function resetUserPassword(params) {
  return requestClient.put('/system/user/update-password', { params })
}

/** 获取用户精简信息列表 */
export function getSimpleUserList() {
  return requestClient.get<SystemUserApi.UserTableRecord[]>('/system/user/simple-list')
}
