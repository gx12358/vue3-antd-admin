import type { DictState } from '@/store/modules/dict'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { isArray } from '@gx-design-vue/pro-utils'
import { getDicts } from '@/services/systemCenter'

export function useDict(dictTypes?: DictType | DictType[], wait?: boolean): {
  dictState: ComputedRef<DictState>
  getDict: (enforce?: boolean) => Promise<void>
  findDict: (type: DictType, value: any, key?: keyof DictRecord) => DictRecord | undefined
} {
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

  function findDict(type: DictType, value: any, key?: keyof DictRecord): DictRecord | undefined {
    return dictValue.value[type]?.data.find(item => item[key || 'dictValue'] === value)
  }

  onMountedOrActivated(() => {
    if (wait) return
    getDict()
  })

  return {
    dictState: dictValue as any,
    getDict,
    findDict
  }
}
