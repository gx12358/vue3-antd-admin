import type { DictState } from '@/store/modules/dict'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { isArray } from '@gx-design-vue/pro-utils'
import { getDicts } from '@/services/system'

export function useDict(dictTypes?: DictType | DictType[], wait?: boolean) {
  const { dict } = useStore()

  const dictValue = computed<DictState>(() => {
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
    return {} as any
  })

  async function getDict(enforce?: boolean) {
    if (!dictTypes) return
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

  function findDictStatus(type: DictType, value: any, key?: keyof DictRecord, trueCode?: any): DictStatus {
    const record = findDict(type, value, key)
    const successCode = [ 'Y', '0', 0 ]
    const isSuccess = trueCode
      ? record?.dictValue === trueCode
      : successCode.includes(record?.dictValue || '')
    if (isSuccess) return 'processing'
    return 'error'
  }

  onMountedOrActivated(() => {
    if (wait) return
    getDict()
  })

  return {
    dictState: dictValue,
    getDict,
    findDict,
    findDictStatus
  }
}
