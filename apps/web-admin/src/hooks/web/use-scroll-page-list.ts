import type { PageState } from '@gx-design-vue/pro-table'
import type { MaybeRef, Ref } from 'vue'
import { app } from '@gx-config'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { isBoolean } from '@gx-design-vue/pro-utils'
import { useScroll } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { computed, isRef, reactive, ref } from 'vue'
import { useRequest } from '@/hooks/core'

const { viewScrollRoot } = app.system

export default function <T, R = any>(serve: any, options: {
  fetchNextType: 'scroll' | 'button';
  pageSize?: MaybeRef<number>;
  otherParams?: R;
  scrollBottom?: number;
  scrollRoot?: string;
  reloadClear?: boolean;
  onAfterMutateData?: (list: T[]) => T[];
} = { fetchNextType: 'scroll', scrollBottom: 124 + 24 * 2 }) {
  const scrollEl = ref<HTMLElement>()
  const watchParams = ref(true)
  const list = ref<T[]>([])

  const state = reactive<{
    init: boolean;
    isMore: boolean;
    y: number;
    oldPageState: PageState;
  }>({
    init: false,
    isMore: true,
    y: 0,
    oldPageState: {
      pageNum: 0,
      pageSize: 0
    }
  })

  const pageState = reactive<PageState>({
    pageNum: 1,
    pageSize: isRef(options.pageSize) ? unref(options.pageSize) : options.pageSize || 10
  })

  const { loading, refresh } = useRequest<T[], R & PageState, PageResult<T>>(
    serve,
    {
      params: computed(() => ({
        ...cloneDeep(options.otherParams),
        ...pageState
      } as (R & PageState))),
      watchParams,
      onAfterMutateData: (response) => {
        return options?.onAfterMutateData
          ? options?.onAfterMutateData?.(response.data.list || [])
          : (response.data?.list || [])
      },
      onBefore: (params) => {
        if (params?.pageNum === 1) {
          const reloadClear = isBoolean(options?.reloadClear) ? options?.reloadClear : true
          if (reloadClear)
            list.value = []
          state.init = false
        }
      },
      onSuccess: (data, response) => {
        list.value = pageState?.pageNum === 1 ? data : [ ...list.value as unknown as T[], ...data ]
        state.isMore = list.value.length < (response.data.totalCount || 0)
        state.init = true
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
        bottom: options?.scrollBottom || 124 + 24 * 2
      }
    })

    let stopWatchBottom: Fn | null

    let stopWatchScrollY: Fn | null

    onMountedOrActivated(() => {
      if (stopWatchBottom)
        stopWatchBottom?.()
      if (stopWatchScrollY)
        stopWatchScrollY?.()
      stopWatchBottom = null
      stopWatchScrollY = null

      stopWatchBottom = watch(() => arrivedState.bottom, (val) => {
        if (val && !loading.value && state.isMore) {
          pageState.pageNum += 1
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

  watch(() => options.otherParams, (val) => {
    if (val) {
      pageState.pageNum = 1
    }
  }, { deep: true })

  const handleNext = () => pageState.pageNum += 1

  const reloadList = (count?: number) => {
    watchParams.value = false
    state.oldPageState = { ...pageState }
    pageState.pageNum = 1
    pageState.pageSize = count || list.value.length
    refresh()

    // 这里再返回之前的翻页顺序
    nextTick(() => {
      watchParams.value = true
    })
  }

  return {
    state,
    list,
    hasEmpty,
    loading,
    initLoading,
    pageState,
    reloadList,
    handleNext
  }
}
