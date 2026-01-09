import type { DictState } from '@/store/modules/dict'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { isArray, isBoolean, isNumber } from '@gx-design-vue/pro-utils'
import { getDictDataPage } from '@/services/system/dict'

export const colorTypeMap: any = {
  'info': 'default',
  'primary': 'processing',
  'danger': 'error',
}

function changeMapParams(data: DictRecord[]): DictRecord[] {
  return data.map(item => ({
    ...item,
    label: item.label || item.dictLabel || '',
    value: item.value || item.dictValue || '',
  })).filter(item => item.label && item.value)
}

const pageState = {
  pageNo: 1,
  pageSize: 100
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
        dict.setState({ [`${types}`]: { loading: true } })
        try {
          const { list = [] } = await getDictDataPage({ ...pageState, dictType: types })
          dict.setState({ [`${types}`]: { data: changeMapParams(list) } })
        } catch {}
        dict.setState({ [`${types}`]: { loading: false } })
      }
      return
    }

    if (isArray(types)) {
      for (let i = 0; i < types.length; i += 1) {
        const key = types[i]
        if (dict[key]?.loading) return
        if (enforce || !dict[key] || !dict[key]?.data?.length) {
          dict.setState({ [`${key}`]: { loading: true } })
          getDictDataPage({ ...pageState, dictType: key }).then(({ list }) => {
            dict.setState({ [`${key}`]: { data: changeMapParams(list || []) } })
          }).finally(() => {
            dict.setState({ [`${key}`]: { loading: false } })
          })
        }
      }
    }
  }

  function findDict(type: DictType, value: any, key?: keyof DictRecord): DictRecord | undefined {
    return dictValue.value[type]?.data.find((item) => {
      const dictKey = key || 'value'
      const numberValue = Number(item[key || 'value'])
      return item[dictKey] === value
        ? true
        : isNumber(numberValue) && !Number.isNaN(numberValue) ? numberValue === value : false
    })
  }

  function getDictTagStatus(type: DictType, value: any, key?: keyof DictRecord, trueCode?: any): DictStatus {
    const record = findDict(type, value, key)
    if (!record) return 'default'

    if (record.colorType) {
      return colorTypeMap[record.colorType] || record.colorType || 'default'
    }
    const successCode = [ 'Y', '0', 0 ]
    const isSuccess = trueCode
      ? record.value === trueCode
      : isBoolean(record.value)
        ? record.value
        : successCode.includes(record.value || '')
    if (isSuccess) return 'success'
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
    getDictTagStatus
  }
}
