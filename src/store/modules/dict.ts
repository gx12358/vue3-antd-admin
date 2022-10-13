import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-dict 数字字典
 */
export interface DictState {
  data: RecordType;
}

export const useStoreDict = defineStore('dict', () => {
  const state = reactive({
    data: {}
  } as DictState)

  const setDictData = (type, value) => {
    state.data[type] = value
  }

  return {
    ...toRefs(state),
    setDictData
  }
})
