import type { DictState } from '@/store/modules/dict'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { isArray } from '@gx-design-vue/pro-utils'
import { getDicts } from '@/services/system'

function changeMapParams(data: DictRecord[]): SystemDictRecord[] {
  return data.map(item => ({
    id: item.id,
    label: item.label || item.dictLabel,
    value: item.value || item.dictValue,
  }))
}

export function useDict(types?: DictType | DictType[], wait?: boolean) {
  const { dict } = useStore()

  const dictValue = computed<DictState>(() => {
    if (typeof types === 'string') {
      return {
        [`${types}`]: dict[types]
      }
    }
    if (isArray(types)) {
      const result: Partial<DictState> = {}
      types.forEach((key) => {
        result[`${key}`] = dict[key]
      })
      return result
    }
    return {} as any
  })

  async function getDict(enforce?: boolean) {
    if (!types) return
    if (typeof types === 'string') {
      if (dict[types]?.loading) return
      if (enforce || !dict[types] || !dict[types]?.data?.length) {
        dict.setValue({ [`${types}`]: { loading: true } })
        try {
          const { list = [] } = await getDicts<PageResult<DictRecord>>({ dictType: types })
          dict.setValue({ [`${types}`]: { data: changeMapParams(list) } })
        } catch {}
        dict.setValue({ [`${types}`]: { loading: false } })
      }
      return
    }

    if (isArray(types)) {
      for (let i = 0; i < types.length; i += 1) {
        const key = types[i]
        if (dict[key]?.loading) return
        if (enforce || !dict[key] || !dict[key]?.data?.length) {
          dict.setValue({ [`${key}`]: { loading: true } })
          getDicts<PageResult<DictRecord>>({ dictType: key }).then(({ list }) => {
            dict.setValue({ [`${key}`]: { data: changeMapParams(list || []) } })
          }).finally(() => {
            dict.setValue({ [`${key}`]: { loading: false } })
          })
        }
      }
    }
  }

  function findDict(type: DictType, value: any, key?: keyof DictRecord): SystemDictRecord | undefined {
    return dictValue.value[type]?.data.find(item => item[key || 'value'] === value)
  }

  function findDictStatus(type: DictType, value: any, key?: keyof DictRecord, trueCode?: any): DictStatus {
    const record = findDict(type, value, key)
    const successCode = [ 'Y', '0', 0 ]
    const isSuccess = trueCode
      ? record?.value === trueCode
      : successCode.includes(record?.value || '')
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
