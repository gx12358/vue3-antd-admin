import { computed, ComputedRef, reactive, ref, Ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { ProTableProps } from '../Table'
import type { SearchConfig } from '../types/table'
import type { ProSearchMap } from '../types/column'
import { handleFormDefaultValue } from '../utils'

export function useTableForm({ search, searchMap, params, columns }: {
  search: Ref<SearchConfig>;
  searchMap: Ref<ProSearchMap[]>;
  params: Ref<ProTableProps['params']>;
  columns: ComputedRef<ProTableProps['columns']>;
}) {
  const formParamsRef = reactive<RecordType>({})
  const defaultParamsRef = reactive<RecordType>({})
  const formDataRef: Ref<ProSearchMap[]> = ref([])

  const hasSearch = computed(() => !!search.value.showSearch)

  watch(
    hasSearch.value
      ? [ () => searchMap.value, () => columns.value ]
      : [ () => searchMap.value, () => columns.value, () => params.value ],
    () => {
      let defaultParams = {}
      const searchData = cloneDeep(searchMap.value || [])

      columns.value.map(item => {
        if (item.searchConfig) searchData.push(item.searchConfig)
        return item
      })

      formDataRef.value = cloneDeep(searchData)
      defaultParams = handleFormDefaultValue(searchData)

      Object.assign(defaultParamsRef, { ...defaultParams })

      Object.assign(formParamsRef, {
        ...((params.value as RecordType) || {}),
        ...defaultParams
      })
    }, {
      deep: true,
      immediate: true
    })

  function setFormParams(params) {
    Object.assign(formParamsRef, params)
  }

  return { formDataRef, formParamsRef, defaultParamsRef, setFormParams }
}
