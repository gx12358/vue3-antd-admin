import { ref, unref, computed, watchEffect, Ref } from 'vue'

export function useLoading({ emit, loading }: { loading: Ref<boolean>, emit: EmitType }) {

  const loadingRef = ref(loading.value)

  watchEffect(() => {
    loadingRef.value = loading.value
  })

  const getLoading = computed(() => unref(loadingRef) || false)

  function setLoading(loading: boolean) {
    loadingRef.value = loading
    emit('loadingChange', true)
  }

  return { getLoading, setLoading }
}
