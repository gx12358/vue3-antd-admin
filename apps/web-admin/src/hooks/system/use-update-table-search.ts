import { watch } from 'vue'

export function useUpdateTableSearch<T = string>(key: DictType, updateProps: {
  key: T;
  callback: Fn
}) {
  const { dict } = useStore()

  watch(
    () => dict[key], (val) => {
      updateProps.callback(updateProps.key, {
        loading: val.loading,
        valueEnum: val?.data.map((item) => {
          return {
            text: item.dictLabel,
            value: item.dictValue
          }
        })
      })
    },
    { deep: true, immediate: true }
  )
}
