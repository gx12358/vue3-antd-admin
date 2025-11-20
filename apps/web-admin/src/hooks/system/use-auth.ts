import type { Ref } from 'vue'
import { isArray, isBoolean, isFunction, isString } from '@gx-design-vue/pro-utils'
import { ref } from 'vue'

export function useAuth(rootValue?: any, rootType?: 'some' | 'all'): {
  auths: Ref<boolean | object>
  hasAuth: (value: object | string | string[], type?: 'some' | 'all') => boolean
} {
  const { permission } = useStore()
  const allAuthStr = ref('*:*:*')
  const auths = ref<object | boolean>({})

  function hasAuth(value: any, type: 'some' | 'all' = 'some') {
    let hasAuth = false
    if (value) {
      const admin = permission.auths?.includes(allAuthStr.value)
      if (admin) {
        hasAuth = true
        auths.value = true
      } else if (isString(value) && permission.auths) {
        auths.value = permission.auths.includes(value)
        hasAuth = permission.auths.includes(value)
      } else if (isArray(value) && permission.auths) {
        if (type === 'some') {
          const stringAuth = value.filter(key => isString(key)).some(key => permission.auths?.includes(key))
          const fnAuth = value.filter(fn => isFunction(fn)).some(fn => !!fn())
          const boolAuth = value.filter(fn => isBoolean(fn)).some(fn => fn)
          auths.value = stringAuth || fnAuth || boolAuth
          hasAuth = stringAuth || fnAuth || boolAuth
        } else if (type === 'all') {
          const stringAuth = value.filter(key => isString(key)).every(key => permission.auths?.includes(key))
          const fnAuth = value.filter(fn => isFunction(fn)).every(fn => !!fn())
          const boolAuth = value.filter(fn => isBoolean(fn)).every(fn => fn)
          auths.value = stringAuth && fnAuth && boolAuth
          hasAuth = stringAuth && fnAuth && boolAuth
        }
      }
    }

    return hasAuth
  }

  if (rootValue) {
    hasAuth(rootValue, rootType)
  }

  return {
    auths,
    hasAuth
  }
}
