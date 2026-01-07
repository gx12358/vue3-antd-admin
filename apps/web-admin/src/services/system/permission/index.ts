import type * as SystemPermissionApi from './typing'
import { requestClient } from '@/services/base'

export type {
  SystemPermissionApi
}

/** 查询角色拥有的菜单权限 */
export async function getRoleMenuList(roleId: number) {
  return requestClient.get<number[]>(
    `/system/permission/list-role-menus?roleId=${roleId}`,
  )
}

/** 赋予角色菜单权限 */
export async function assignRoleMenu(
  data: SystemPermissionApi.AssignRoleMenuReqVO,
) {
  return requestClient.post('/system/permission/assign-role-menu', { data })
}

/** 赋予角色数据权限 */
export async function assignRoleDataScope(
  data: SystemPermissionApi.AssignRoleDataScopeReqVO,
) {
  return requestClient.post('/system/permission/assign-role-data-scope', { data })
}

/** 查询用户拥有的角色数组 */
export async function getUserRoleList(userId: number) {
  return requestClient.get<number[]>(
    `/system/permission/list-user-roles?userId=${userId}`,
  )
}

/** 赋予用户角色 */
export async function assignUserRole(
  data: SystemPermissionApi.AssignUserRoleReqVO,
) {
  return requestClient.post('/system/permission/assign-user-role', { data })
}
