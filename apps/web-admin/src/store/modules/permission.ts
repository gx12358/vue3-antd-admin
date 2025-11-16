import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { defineStore } from 'pinia'

export interface PermissionState {
  admin: boolean
  role: string[] | undefined
  ability: string[]
}

export const useStorePermission = defineStore('permission', () => {
  const [ state, setValue ] = useReactiveState<PermissionState>({
    admin: false,
    role: undefined,
    ability: []
  }, { omitNil: false, omitEmpty: false })

  return {
    ...toRefs(state),
    setValue
  }
})
