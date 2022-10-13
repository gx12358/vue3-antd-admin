import { reactive, watchEffect } from 'vue'
import type { ProSearchMap } from '../../types/column'

export function useForm(defaultParams: RecordType, searchMap: ProSearchMap[]) {
  const formState = reactive({})

  watchEffect(() => {
    resetFormState()
  })

  function resetFormState() {
    Object.keys(defaultParams).map(item => {
      changeFormState(item, defaultParams[item])
    })
    const dateRangeRecord = searchMap.find((item) => item.valueType === 'dateRange')
    if (dateRangeRecord) {
      changeFormState(
        dateRangeRecord.name,
        defaultParams[dateRangeRecord.rangeStartName || 'start']
          ? [
            defaultParams[dateRangeRecord.rangeStartName || 'start'],
            defaultParams[dateRangeRecord.rangeEndName || 'end']
          ]
          : []
      )
    }
  }

  function changeFormState(key, value) {
    formState[key] = value
  }

  return {
    formState,
    resetFormState,
    changeFormState
  }
}
