import type { PiniaStoreValue } from '@gx-design-vue/pro-hooks'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { defineStore } from 'pinia'
import { toRefs } from 'vue'

export type PermissionState = {
  admin: boolean
  role: string[]
  ability: string[]
}

type PermissionStore = PiniaStoreValue<PermissionState>

export const useStorePermission = defineStore<'permission', PermissionStore>('permission', () => {
  const [ state, setValue ] = useReactiveState<PermissionState>({
    admin: false,
    role: [],
    ability: []
  })

  return {
    ...toRefs(state),
    setValue
  }
})
