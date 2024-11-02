import type { PiniaStoreValue } from '@gx-design-vue/pro-hooks'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { defineStore } from 'pinia'
import { toRefs } from 'vue'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-global 全局属性
 */
export interface GlobalState {
  keepAlive: boolean;
  pageLoading: boolean;
  showProgressBar: boolean;
  disabledScrollTop: boolean;
}

type GlobalStoreValue = PiniaStoreValue<GlobalState, {
  setValue: (value: Partial<GlobalState>) => void
}>

export const useStoreGlobal = defineStore<'global', GlobalStoreValue>('global', () => {
  const [ state, setValue ] = useReactiveState<GlobalState>({
    keepAlive: true,
    pageLoading: false,
    showProgressBar: true,
    disabledScrollTop: false
  })

  return {
    ...toRefs(state),
    setValue
  }
})
