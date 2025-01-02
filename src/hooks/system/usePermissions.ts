import type { Ref } from 'vue'
import { isArray, isBoolean, isFunction, isString } from '@gx-design-vue/pro-utils'
import { ref } from 'vue'

export function usePermissions(rootValue?: any, rootType?: 'some' | 'all'): {
  permission: Ref<boolean | object>
  hasPermission: (value: object | string | string[], type?: 'some' | 'all') => boolean
} {
  const { permission } = useStore()
  const all_permission = ref('*:*:*')
  const permissionRef = ref<object | boolean>({})

  function hasPermission(value: any, type: 'some' | 'all' = 'some') {
    let hasAuth = false
    if (value) {
      const admin = permission.ability.includes(all_permission.value)
      if (admin) {
        hasAuth = true
        permissionRef.value = true
      } else if (isString(value)) {
        permissionRef.value = permission.ability.includes(value)
        hasAuth = permission.ability.includes(value)
      } else if (isArray(value)) {
        if (type === 'some') {
          const stringAuth = value.filter(key => isString(key)).some(key => permission.ability.includes(key))
          const fnAuth = value.filter(fn => isFunction(fn)).some(fn => !!fn())
          const boolAuth = value.filter(fn => isBoolean(fn)).some(fn => fn)
          permissionRef.value = stringAuth || fnAuth || boolAuth
          hasAuth = stringAuth || fnAuth || boolAuth
        } else if (type === 'all') {
          const stringAuth = value.filter(key => isString(key)).every(key => permission.ability.includes(key))
          const fnAuth = value.filter(fn => isFunction(fn)).every(fn => !!fn())
          const boolAuth = value.filter(fn => isBoolean(fn)).every(fn => fn)
          permissionRef.value = stringAuth && fnAuth && boolAuth
          hasAuth = stringAuth && fnAuth && boolAuth
        }
      }
    }

    return hasAuth
  }

  if (rootValue) {
    hasPermission(rootValue, rootType)
  }

  return {
    permission: permissionRef,
    hasPermission
  }
}
