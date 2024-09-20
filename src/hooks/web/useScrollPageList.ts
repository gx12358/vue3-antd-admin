import type { MaybeRef, Ref } from 'vue'
import useRequest from '@gx-admin/hooks/core/useRequest'
import { defaultSettings } from '@gx-config'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { isBoolean } from '@gx-design-vue/pro-utils'
import { useScroll } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { computed, isRef, reactive, ref } from 'vue'

const { viewScrollRoot } = defaultSettings

export default function <T, R = any>(serve: any, options: {
  fetchNextType: 'scroll' | 'button';
  pageSize?: MaybeRef<number>;
  otherParmas?: R;
  scrollBotomm?: number;
  scrollRoot?: string;
  reloadClear?: boolean;
  onAfterMutateData?: (list: T[]) => T[];
} = { fetchNextType: 'scroll', scrollBotomm: 124 + 24 * 2 }) {
  const scrollEl = ref<HTMLElement>()
  const stopWatchParams = ref(false)
  const list = ref<T[]>([])

  const state = reactive({
    init: false,
    isMore: true,
    y: 0,
    oldPageState: {
      pageNum: 0,
      pageSize: 0
    }
  })

  const pageState = reactive({
    pageNum: 1,
    pageSize: isRef(options.pageSize) ? unref(options.pageSize) : options.pageSize
  })

  const { data, loading, refresh } = useRequest<PageResult<T>, R & {
    pageNum: number;
    pageSize: number;
  }, T[]>(serve, {
    params: computed(() => ({
      ...cloneDeep(options.otherParmas),
      ...pageState
    })),
    stopWatchParams,
    onAfterMutateData: (response) => {
      return options?.onAfterMutateData?.(response.list || []) || (response?.list || [])
    },
    onBefore: (params) => {
      if (params?.pageNum === 1) {
        const reloadClear = isBoolean(options?.reloadClear) ? options?.reloadClear : true
        if (reloadClear)
          list.value = []
        state.init = false
      }
    },
    onSuccess: (response) => {
      list.value = pageState?.pageNum === 1 ? data.value as unknown as any[] : unref(list).concat(data.value)
      state.isMore = unref(list).length < (response.totalCount || 0)
      state.init = true
    }
  })

  const hasEmpty = computed(() => state.init && unref(list).length === 0)
  const initLoading = computed(() => !state.init && loading.value)

  if (options?.pageSize && isRef(options.pageSize)) {
    watch(() => (options.pageSize as Ref<number>)?.value, (val) => {
      stopWatchParams.value = true
      if (val)
        pageState.pageSize = val
      nextTick(() => {
        stopWatchParams.value = false
      })
    })
  }

  if (options.fetchNextType === 'scroll' && (options?.scrollRoot || viewScrollRoot)) {
    const { arrivedState, y } = useScroll(scrollEl, {
      offset: {
        bottom: options?.scrollBotomm || 124 + 24 * 2
      }
    })

    let stopWatchBottom: Fn

    let stopWatchScrollY: Fn

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
    scrollEl.value = document.querySelector(options?.scrollRoot || viewScrollRoot)
    stopWatchParams.value = false
  })

  onDeactivated(() => {
    stopWatchParams.value = true
  })

  watch(() => options.otherParmas, (val) => {
    if (val) {
      pageState.pageNum = 1
    }
  }, { deep: true })

  const handleNext = () => pageState.pageNum += 1

  const reloadList = (count?: number) => {
    stopWatchParams.value = true
    state.oldPageState = { ...pageState }
    pageState.pageNum = 1
    pageState.pageSize = count || list.value.length
    refresh()

    // 这里再返回之前的翻页顺序
    nextTick(() => {
      stopWatchParams.value = false
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
