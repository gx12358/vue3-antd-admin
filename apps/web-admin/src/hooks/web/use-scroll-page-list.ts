import type { Fn } from '@gx/types'
import type { PageResult } from '@gx/types/request'
import type { MaybeRef, Reactive, Ref } from 'vue'
import { app } from '@gx-config'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { cloneDeep, deepMerge, isBoolean } from '@gx-design-vue/pro-utils'
import { useRequest } from '@gx/hooks'
import { useScroll } from '@vueuse/core'
import { computed, isRef, reactive, ref, unref } from 'vue'

const { viewScrollRoot } = app.system

export default function <T, R extends object = Record<string, any>>(serve: any, options: {
  fetchNextType: 'scroll' | 'button';
  pageSize?: MaybeRef<number>;
  params?: Reactive<R>;
  scrollBottom?: number;
  scrollRoot?: string;
  reloadClear?: boolean;
} = { fetchNextType: 'scroll', scrollBottom: 124 + 24 * 2 }) {
  const scrollEl = ref<HTMLElement>()
  const watchParams = ref(true)
  const refreshLoading = ref(false)
  const list = ref<T[]>([])

  const state = reactive<{
    init: boolean;
    isMore: boolean;
    y: number;
    oldPageState: SystemPageState;
  }>({
    init: false,
    isMore: true,
    y: 0,
    oldPageState: {
      pageNo: 0,
      pageSize: 0
    }
  })

  const pageState = reactive<SystemPageState>({
    pageNo: 1,
    pageSize: isRef(options.pageSize) ? unref(options.pageSize) : options.pageSize || 10
  })

  const params = ref<R & SystemPageState>(deepMerge(toRaw(pageState), cloneDeep(options.params || {} as any)))

  const { loading, run } = useRequest<PageResult<T>, R & SystemPageState>(
    serve,
    {
      params: params as any,
      watchParams,
      onBefore: (params) => {
        if (params?.pageNo === 1) {
          const reloadClear = isBoolean(options?.reloadClear) ? options?.reloadClear : true
          if (reloadClear) list.value = []
          if (!state.init) {
            state.init = false
          }
        }
      },
      onSuccess: (result) => {
        list.value = pageState?.pageNo === 1 ? result.list : [ ...list.value as unknown as T[], ...result.list ]
        state.isMore = list.value.length < result.total
      },
      onFinal: () => {
        state.init = true
        refreshLoading.value = false
      }
    }
  )

  const hasEmpty = computed(() => state.init && unref(list).length === 0)
  const initLoading = computed(() => !state.init && loading.value)

  if (options?.pageSize && isRef(options.pageSize)) {
    watch(() => (options.pageSize as Ref<number>)?.value, (val) => {
      watchParams.value = false
      if (val)
        pageState.pageSize = val
      nextTick(() => {
        watchParams.value = true
      })
    })
  }

  if (options.fetchNextType === 'scroll' && (options?.scrollRoot || viewScrollRoot)) {
    const { arrivedState, y } = useScroll(scrollEl, {
      offset: {
        bottom: options?.scrollBottom
      }
    })

    let stopWatchBottom: Fn | null

    let stopWatchScrollY: Fn | null

    onMountedOrActivated(() => {
      if (stopWatchBottom) stopWatchBottom?.()
      if (stopWatchScrollY) stopWatchScrollY?.()
      stopWatchBottom = null
      stopWatchScrollY = null

      stopWatchBottom = watch(() => arrivedState.bottom, (val) => {
        if (val && !loading.value && state.isMore) {
          handleNext()
        }
      })

      stopWatchScrollY = watch(() => y.value, (val) => {
        state.y = val
      })
    })

    onUnmounted(() => {
      stopWatchBottom?.()
      stopWatchScrollY?.()
    })

    onDeactivated(() => {
      stopWatchBottom?.()
      stopWatchScrollY?.()
    })
  }

  onMountedOrActivated(() => {
    scrollEl.value = document.querySelector(options?.scrollRoot || viewScrollRoot) as HTMLElement
    watchParams.value = true
  })

  onDeactivated(() => {
    watchParams.value = false
  })

  watch(() => options.params, (value) => {
    if (value) {
      pageState.pageNo = 1
      params.value = deepMerge(unref(params), cloneDeep({
        ...value,
        ...toRaw(pageState)
      }))
    }
  }, { deep: true })

  function handleNext() {
    pageState.pageNo = pageState.pageNo + 1
    params.value = deepMerge(unref(params), toRaw(pageState))
  }

  const reloadList = (count?: number) => {
    watchParams.value = false
    refreshLoading.value = true
    state.oldPageState = { ...pageState }
    pageState.pageNo = 1
    pageState.pageSize = count || list.value.length
    params.value = deepMerge(unref(params), toRaw(pageState))
    run({ params: unref(params) })

    // 这里再返回之前的翻页顺序
    nextTick(() => {
      watchParams.value = true
      pageState.pageNo = state.oldPageState.pageNo
      pageState.pageSize = state.oldPageState.pageSize
    })
  }

  return {
    state,
    list,
    hasEmpty,
    loading,
    initLoading,
    refreshLoading,
    pageState,
    reloadList,
    handleNext
  }
}
