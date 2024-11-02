import type { DictState } from '@/store/modules/dict'
import type { DictRecord, DictType } from '@gx-mock/config/dict'
import { getDicts } from '@/services/systemCenter'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { isArray } from '@gx-design-vue/pro-utils'

export function useDict(dictTypes: DictType | DictType[]): [ ComputedRef<DictState>, (enforce?: boolean) => Promise<void> ] {
  const { dict } = useStore()

  const dictValue = computed<Partial<DictState>>(() => {
    if (typeof dictTypes === 'string') {
      return {
        [`${dictTypes}`]: dict[dictTypes]
      }
    }
    if (isArray(dictTypes)) {
      const result: Partial<DictState> = {}
      dictTypes.forEach((key) => {
        result[`${key}`] = dict[key]
      })
      return result
    }
    return {}
  })

  async function getDict(enforce?: boolean) {
    if (typeof dictTypes === 'string') {
      if (dict[dictTypes]?.loading) return
      if (enforce || !dict[dictTypes] || !dict[dictTypes]?.data?.length) {
        dict.setValue({ [`${dictTypes}`]: { loading: true } })
        const response: ResponseResult<DictRecord[]> = await getDicts(dictTypes)
        if (response) {
          const data: DictRecord[] = response.data || []
          dict.setValue({ [`${dictTypes}`]: { data } })
        }
        dict.setValue({ [`${dictTypes}`]: { loading: false } })
      }
      return
    }

    if (isArray(dictTypes)) {
      for (let i = 0; i < dictTypes.length; i += 1) {
        const key = dictTypes[i]
        if (dict[key]?.loading) return
        if (enforce || !dict[key] || !dict[key]?.data?.length) {
          dict.setValue({ [`${key}`]: { loading: true } })
          getDicts(key).then((response: ResponseResult<DictRecord[]>) => {
            if (response) {
              const data: DictRecord[] = response.data || []
              dict.setValue({ [`${key}`]: { data } })
            }
          }).finally(() => {
            dict.setValue({ [`${key}`]: { loading: false } })
          })
        }
      }
    }
  }

  onMountedOrActivated(() => {
    getDict()
  })

  return [ dictValue as unknown as ComputedRef<DictState>, getDict ]
}
