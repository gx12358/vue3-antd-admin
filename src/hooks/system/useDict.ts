import type { DictRecord, DictType } from '@gx-mock/config/dict'
import { getDicts } from '@/services/systemCenter'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { isArray } from '@gx-design-vue/pro-utils'
import { reactive } from 'vue'

export type SystemDictData = Partial<{ loading: boolean; data: DictRecord[] }>

export type SystemDictState = Record<DictType, SystemDictData>

export function useDict(type: DictType | DictType[]) {
  const dictState = reactive<Partial<SystemDictState>>({})

  const { dict: storeDict } = useStore()

  const dictRef = computed(() => storeDict.data)

  async function getDict() {
    let response
    if (typeof type === 'string') {
      dictState[type] = {
        loading: !(unref(dictRef)[type] && unref(dictRef)[type].length)
      }
      if (unref(dictRef)[type] && unref(dictRef)[type].length) {
        dictState[type].data = unref(dictRef)[type]
      } else {
        dictState[type].loading = true
        response = await getDicts(type)
        if (response) {
          const data = (response.data || [])
          storeDict.setDictData(type, data)
          dictState[type].data = data
        }
        dictState[type].loading = false
      }
      return
    }

    if (isArray(type)) {
      for (let i = 0; i < type.length; i += 1) {
        const dictType = type[i]
        dictState[dictType] = {
          loading: !(unref(dictRef)[dictType] && unref(dictRef)[dictType].length)
        }
        if (unref(dictRef)[dictType] && unref(dictRef)[dictType].length) {
          dictState[dictType].data = unref(dictRef)[dictType]
        } else {
          dictState[dictType].loading = true
          response = await getDicts(dictType)
          if (response) {
            const data = (response.data || [])
            storeDict.setDictData(dictType, data)
            dictState[dictType].data = data
          }
          dictState[dictType].loading = false
        }
      }
    }
  }

  onMountedOrActivated(() => {
    getDict()
  })

  return {
    dictState
  }
}
