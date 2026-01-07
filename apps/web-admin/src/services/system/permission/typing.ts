/** 分配用户角色请求 */
export interface AssignUserRoleReqVO {
  userId: number;
  roleIds: number[];
}

/** 分配角色菜单请求 */
export interface AssignRoleMenuReqVO {
  roleId: number;
  menuIds: number[];
}

/** 分配角色数据权限请求 */
export interface AssignRoleDataScopeReqVO {
  roleId: number;
  dataScope: number;
  dataScopeDeptIds: number[];
}
