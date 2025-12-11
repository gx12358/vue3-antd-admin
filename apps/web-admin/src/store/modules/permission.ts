import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { defineStore } from 'pinia'

export interface PermissionState {
  roles: string[] | undefined
  auths: string[] | undefined
  /**
   * 登录租户编号
   */
  tenantId: null | number;
  /**
   * 访问租户编号
   */
  visitTenantId: null | number;
}

export const useStorePermission = defineStore('permission', () => {
  const [ state, setState, clear ] = useReactiveState<PermissionState>({
    roles: undefined,
    auths: undefined,
    tenantId: null,
    visitTenantId: null
  })

  return {
    ...toRefs(state),
    setState,
    clear
  }
})
