import type { Ref } from 'vue'
import { isArray, isObject, isString } from '@gx-design-vue/pro-utils'
import { ref } from 'vue'

export function usePermissions(): {
  permission: Ref<boolean | object>;
  hasPermission: (value: object | string | string[]) => void
} {
  const store = useStore()
  const all_permission = ref('*:*:*')
  const permissions = store.permission.ability
  const permission = ref<object | boolean>({})

  function hasPermission(value: object | string | string[]) {
    if (value && isObject(value) && Object.keys(value).length > 0) {
      Object.keys(value).map((item) => {
        let isExist = true
        const permissionFlag = value[item]
        const hasPermissions = permissions.some((el) => {
          return all_permission.value === el || permissionFlag.includes(el)
        })
        if (!hasPermissions) {
          isExist = false
        }
        permission.value[item] = isExist
        return item
      })
    } else if (isString(value) || isArray(value)) {
      permission.value = permissions.some((el) => {
        return all_permission.value === el || (value as string[]).includes(el)
      })
    }
  }

  return {
    permission,
    hasPermission
  }
}
