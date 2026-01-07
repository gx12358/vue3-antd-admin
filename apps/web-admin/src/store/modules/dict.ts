import { useReactiveState } from '@gx-design-vue/pro-hooks'
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
  common_status: { data: [] },
  system_data_scope: { data: [] },
  system_role_type: { data: [] },
  system_menu_type: { data: [] },
  system_user_sex: { data: [] },
  sys_common_category: { data: [] },
}

export const useStoreDict = defineStore('dict', () => {
  const [ state, setState, clear ] = useReactiveState<DictState>(defaultState)

  return {
    ...toRefs(state),
    setState,
    clear
  }
})
