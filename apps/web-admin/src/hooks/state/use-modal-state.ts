import { cloneDeep } from '@gx-design-vue/pro-utils'
import { reactive } from 'vue'

export function useModalState<T extends object>(props: T) {
  const state = reactive(cloneDeep(props))

  const resetState = () => {
    Object.assign(state, props)
  }

  return {
    state,
    resetState
  }
}
