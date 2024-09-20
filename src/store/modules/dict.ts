import type { DictRecord, DictType } from '@gx-mock/config/dict'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-dict 数字字典
 */
export interface DictState {
  data: Partial<Record<DictType, DictRecord[]>>;
}

export const useStoreDict = defineStore('dict', () => {
  const state = reactive<DictState>({
    data: {}
  })

  const setDictData = (type, value) => {
    state.data[type] = value
  }

  return {
    ...toRefs(state),
    setDictData
  }
})
