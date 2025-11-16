import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-dict 数字字典
 */
export interface SystemDictData {
  loading?: boolean;
  data: DictRecord[]
}

export type DictState = Record<DictType, SystemDictData>

const defaultState: DictState = {
  sys_common_status: { data: [] },
  sys_common_category: { data: [] },
  sys_common_author: { data: [] }
}

export const useStoreDict = defineStore('dict', () => {
  const [ state, setValue ] = useReactiveState<DictState>(defaultState, { omitEmpty: false })

  function clear() {
    setValue(cloneDeep(defaultState))
  }

  return {
    ...toRefs(state),
    setValue,
    clear
  }
})
