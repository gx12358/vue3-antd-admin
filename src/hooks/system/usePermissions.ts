import type { Ref } from 'vue'
import { isArray, isObject, isString } from '@gx-design-vue/pro-utils'
import { ref } from 'vue'

export function usePermissions(): {
  permission: Ref<boolean | object>;
  hasPermission: (value: object | string | string[]) => void
} {
  const { permission } = useStore()
  const all_permission = ref('*:*:*')
  const permissionRef = ref<object | boolean>({})

  function hasPermission(value: object | string | string[]) {
    if (value && isObject(value) && Object.keys(value).length > 0) {
      Object.keys(value).map((item) => {
        let isExist = true
        const permissionFlag = value[item]
        const hasPermissions = permission.ability.some((el) => {
          return all_permission.value === el || permissionFlag.includes(el)
        })
        if (!hasPermissions) {
          isExist = false
        }
        permissionRef.value[item] = isExist
        return item
      })
    } else if (isString(value) || isArray(value)) {
      permissionRef.value = permission.ability.some((el) => {
        return all_permission.value === el || (value as string[]).includes(el)
      })
    }
  }

  return {
    permission: permissionRef,
    hasPermission
  }
}
