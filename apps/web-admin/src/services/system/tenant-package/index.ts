import type { PageResult } from '@gx/types/request'
import type * as SystemTenantPackageApi from './typing'
import { requestClient } from '@/services/base'

export type {
  SystemTenantPackageApi
}

/** 租户套餐列表 */
export function getTenantPackagePage<T = PageResult<SystemTenantPackageApi.TenantPackageTable>>(params) {
  return requestClient.get<T>(
    '/system/tenant-package/page',
    { params },
  )
}

/** 查询租户套餐详情 */
export function getTenantPackage(id: number) {
  return requestClient.get<SystemTenantPackageApi.UpdateTenantPackageTable>(`/system/tenant-package/get?id=${id}`)
}

/** 新增租户套餐 */
export function createTenantPackage(
  data: SystemTenantPackageApi.UpdateTenantPackageTable,
) {
  return requestClient.post('/system/tenant-package/create', { data })
}

/** 修改租户套餐 */
export function updateTenantPackage(
  data: SystemTenantPackageApi.UpdateTenantPackageTable,
) {
  return requestClient.put('/system/tenant-package/update', { data })
}

/** 删除租户套餐 */
export function deleteTenantPackage(params) {
  return requestClient.delete(`/system/tenant-package/delete`, { params })
}

/** 批量删除租户套餐 */
export function deleteTenantPackageList(params) {
  return requestClient.delete(
    `/system/tenant-package/delete-list`, { params }
  )
}

/** 获取租户套餐精简信息列表 */
export function getTenantPackageList() {
  return requestClient.get<SystemTenantPackageApi.TenantPackageTable[]>(
    '/system/tenant-package/get-simple-list',
  )
}
