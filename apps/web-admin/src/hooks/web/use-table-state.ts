import type { BaseTableState } from '@gx-design-vue/pro-table'
import type { MaybeRef } from 'vue'
import { deepMerge, isObject } from '@gx-design-vue/pro-utils'
import { toReactive } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { table } from '@/common'

const { defaultProps } = table

export default function <T extends object = Record<string, any>, R extends object = Record<string, any>>(
  state: MaybeRef<BaseTableState<T, R>>
): BaseTableState<T, R> {
  const tableState = ref<BaseTableState<T, R>>(deepMerge(
    cloneDeep(defaultProps as any),
    getTableState(),
    { omitNil: false, omitEmpty: false }
  ))

  if (state) {
    if (isRef(state)) {
      watch(() => state.value, () => {
        updateTableState()
      }, { deep: true })
    } else if (isReactive(state)) {
      watch(() => state, () => {
        updateTableState()
      }, { deep: true })
    }
  }

  function getTableState(): BaseTableState<T, R> {
    if (state) {
      if (isRef(state) && isObject(state.value)) {
        return cloneDeep({
          ...state.value,
          params: state.value?.params || {} as R
        })
      } else if (isObject(state) && !isRef(state)) {
        return cloneDeep({
          ...toRaw(state),
          params: state?.params || {} as R
        })
      }
    }
    return {}
  }

  function updateTableState() {
    tableState.value = deepMerge(tableState.value as any, getTableState(), {
      omitNil: true,
      omitEmpty: true
    })
  }

  return toReactive(tableState) as unknown as BaseTableState<T, R>
}
