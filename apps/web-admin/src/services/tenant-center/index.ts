import type { AuthApi } from '@/services/user-center'
import { requestClient } from '@/services/base'
import * as SystemTenantApi from './typing'

export { SystemTenantApi }

/** 获取租户列表 */
export async function getTenantSimpleList() {
  return requestClient.get<AuthApi.TenantResult[]>(
    `/system/tenant/simple-list`,
  )
}

/** 使用租户域名，获得租户信息 */
export async function getTenantByWebsite(website: string) {
  return requestClient.get<AuthApi.TenantResult>(
    `/system/tenant/get-by-website?website=${website}`,
  )
}
