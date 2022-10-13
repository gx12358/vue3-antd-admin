import type { Ref } from 'vue'
import { reactive } from 'vue'
import { cloneDeep } from 'lodash-es'

export type FetchResult = {
  code: number
  data: RecordType
}

export type ProRequestData<T, U = Record<string, any>> = (params: U, props: any) => Promise<T>

export default function useFetchData<T, U extends Record<string, any> = FetchResult>(props: {
  params?: Ref<U>
  request?: Ref<ProRequestData<T, U>>
}) {
  const loading = ref(false)
  const result = reactive({
    code: -1 // -1初始化 0成功 1失败
  } as FetchResult)

  const fetchData = async () => {
    loading.value = !!props.request.value
    const loadData = await props.request.value?.(props.params.value as U, props)
    Object.assign(result, cloneDeep(loadData))
    loading.value = false
  }

  watch(
    [() => props.request.value, () => props.params.value],
    () => {
      result.code = -1
      fetchData()
    },
    {
      deep: true,
      immediate: true
    }
  )

  return {
    result,
    loading
  }
}
