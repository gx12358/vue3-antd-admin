import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { defineStore } from 'pinia'

export interface PermissionState {
  role: string[] | undefined
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
  const [ state, setValue ] = useReactiveState<PermissionState>({
    role: undefined,
    auths: undefined,
    tenantId: null,
    visitTenantId: null
  }, { omitNil: false, omitEmpty: false })

  function clear() {
    setValue({
      role: undefined,
      auths: undefined,
      tenantId: null,
      visitTenantId: null
    })
  }

  return {
    ...toRefs(state),
    setValue,
    clear
  }
})
