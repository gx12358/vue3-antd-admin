import type { PageResult } from '@gx/types/request'
import { requestClient } from '@/services/base'
import * as SystemTenantApi from './typing'

export { SystemTenantApi }

/** 使用租户域名，获得租户信息 */
export async function getTenantByWebsite(website: string) {
  return requestClient.get<SystemTenantApi.TenantTableRecord>(
    `/system/tenant/get-by-website?website=${website}`,
  )
}

/** 查询租户详情 */
export function getTenant(id: number) {
  return requestClient.get<SystemTenantApi.UpdateTenantTableRecord>(
    `/system/tenant/get?id=${id}`,
  )
}

/** 租户列表 */
export function getTenantPage<T = PageResult<SystemTenantApi.TenantTableRecord>>(params) {
  return requestClient.get<T>(
    '/system/tenant/page',
    { params },
  )
}

/** 获取租户精简信息列表 */
export function getTenantList() {
  return requestClient.get<SystemTenantApi.TenantTableRecord[]>(
    '/system/tenant/simple-list',
  )
}

/** 新增租户 */
export function createTenant(data: SystemTenantApi.UpdateTenantTableRecord) {
  return requestClient.post('/system/tenant/create', { data })
}

/** 修改租户 */
export function updateTenant(data: SystemTenantApi.UpdateTenantTableRecord) {
  return requestClient.put('/system/tenant/update', { data })
}

/** 删除租户 */
export function deleteTenant(params) {
  return requestClient.delete(`/system/tenant/delete`, { params })
}

/** 批量删除租户 */
export function deleteTenantList(params) {
  return requestClient.delete(
    `/system/tenant/delete-list`, { params }
  )
}

/** 导出租户 */
export function exportTenant(params: any) {
  return requestClient.get('/system/tenant/export-excel', {
    download: true,
    params,
  })
}
