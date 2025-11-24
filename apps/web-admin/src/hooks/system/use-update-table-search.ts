export function useUpdateTableSearchMap<T = string>(key: DictType, updateProps: {
  key: T;
  callback: Fn
}) {
  const { dict } = useStore()

  watch(
    () => dict[key], (val) => {
      if (!val) return
      updateProps.callback(updateProps.key, {
        loading: val.loading,
        valueEnum: val?.data.map((item) => {
          return {
            label: item.label,
            value: item.value
          }
        })
      })
    },
    { deep: true, immediate: true }
  )
}
