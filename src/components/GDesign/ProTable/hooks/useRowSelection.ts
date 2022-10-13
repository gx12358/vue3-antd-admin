import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { arrayRepeat } from '@/utils/util'
import type { ProTableProps } from '../Table'

export function useRowSelection(
  rowKey: Ref<ProTableProps['rowKey']>,
  rowSelection: Ref<ProTableProps['rowSelection']>
) {
  const selectedKey: Ref<(string | number)[]> = ref([])
  const selectedItem: Ref<RecordType[]> = ref([])

  watch(() => rowSelection.value?.defaultSelectKeys, (keys) => {
    selectedKey.value = arrayRepeat([...selectedKey.value, ...(keys || [])])
  }, {
    deep: true,
    immediate: true
  })

  watch(() => rowSelection.value?.defaultSelectRows, (rows) => {
    if (rows) {
      rows.forEach(item => {
        if (selectedItem.value.every(el => el[rowKey.value] !== item?.[rowKey.value]))
          selectedItem.value.push(cloneDeep(item))
      })
    }
  }, {
    deep: true,
    immediate: true
  })

  const selectRowKey = (record, selected) => {
    if (selected) {
      if (record?.[rowKey.value]) {
        selectedKey.value.push(record[rowKey.value])
        selectedItem.value.push(record)
      }
    } else {
      selectedKey.value = selectedKey.value.filter(item => item !== record[rowKey.value])
      selectedItem.value = selectedItem.value.filter(item => item[rowKey.value] !== record[rowKey.value])
    }
  }

  const changeRowKey = () => {
    rowSelection.value?.onChange(selectedKey.value, selectedItem.value)
  }

  const selectAllRowKey = (selected, selectedRows, changeRows) => {
    if (selected) {
      selectedRows.map(item => {
        if (selectedKey.value.every(el => el !== item?.[rowKey.value])) {
          if (item?.[rowKey.value]) {
            selectedKey.value.push(item[rowKey.value])
            selectedItem.value.push(item)
          }
        }
        return item
      })
    } else {
      changeRows.map(item => {
        if (selectedKey.value.some(el => el === item?.[rowKey.value])) {
          selectedKey.value = selectedKey.value.filter(el => el !== item[rowKey.value])
          selectedItem.value = selectedItem.value.filter(el => el[rowKey.value] !== item[rowKey.value])
        }
        return item
      })
    }
  }

  const removeRowKeys = (keyList: (string | number)[]) => {
    selectedKey.value = selectedKey.value.filter(el => !keyList.includes(el))
    selectedItem.value = selectedItem.value.filter(el => !keyList.includes(el?.[rowKey.value]))
    changeRowKey()
  }

  return {
    selectedKey,
    selectRowKey,
    selectAllRowKey,
    removeRowKeys,
    changeRowKey
  }
}
