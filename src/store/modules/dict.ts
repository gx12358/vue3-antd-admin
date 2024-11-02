import type { PiniaStoreValue } from '@gx-design-vue/pro-hooks'
import type { DictRecord, DictType } from '@gx-mock/config/dict'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { defineStore } from 'pinia'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-dict 数字字典
 */
export interface SystemDictData { loading?: boolean; data: DictRecord[] }

export type DictState = Record<DictType, SystemDictData>

type DictStoreValue = PiniaStoreValue<DictState>

export const useStoreDict = defineStore<'dict', DictStoreValue>('dict', () => {
  const [ state, setValue ] = useReactiveState<DictState, DictState>({
    sys_common_status: { data: [] },
    sys_common_category: { data: [] },
    sys_common_author: { data: [] }
  })

  return {
    ...toRefs(state),
    setValue
  }
})
