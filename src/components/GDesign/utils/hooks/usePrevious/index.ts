const usePrevious = <T>(state: T): T | undefined => {
  const val = ref<T>()

  watchEffect(() => {
    val.value = state
  })

  return val.value
}

export default usePrevious
