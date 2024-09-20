import type { NumberToShow } from '@/utils/util'
import type { AccountListRecord } from '@gx-mock/datasSource/project'
import type { TabsKey } from '@gx-mock/datasSource/user/account'
import { scrollToContainer, toConvertNumberShow } from '@/utils/util'
import { useScrollPageList } from '@gx-admin/hooks/web'
import { useAccountCenterContext } from '../context'

export type ListRecord = AccountListRecord & {
  tagList: string[];
  activeUserObj: NumberToShow;
}

export default function (serve: (data: any) => Promise<ResponseResult>) {
  const getScrollRoot = (key: TabsKey) => `card-${key}-wrap`

  const { global } = useStore()
  const { isMobile, contentHeight, activeKey } = useAccountCenterContext()

  const scrollRef = ref()
  const scrollTop = ref(0)
  const pullRefresh = ref(false)
  const openFloatBtn = ref(false)

  const { list, loading, state, initLoading, reloadList } = useScrollPageList<ListRecord>(serve, {
    fetchNextType: 'scroll',
    scrollRoot: isMobile.value ? '' : `.${getScrollRoot(activeKey.value)}`,
    pageSize: 20,
    reloadClear: false,
    onAfterMutateData: list => list.map(item => ({
      ...item,
      tagList: (item.tags || '')?.split(','),
      activeUserObj: toConvertNumberShow(item.activeUser, { unit: '万' })
    }))
  })

  watch(loading, val => !val && (pullRefresh.value = false))
  watch(() => state.y, val => openFloatBtn.value = val > (isMobile.value ? 600 : 100))

  const handleScrollTop = (count: number) => {
    if (isMobile.value) {
      scrollToContainer({ count })
    } else {
      scrollRef.value?.scrollTo({
        top: count,
        behavior: 'smooth'
      } as ScrollOptions)
      scrollToContainer({ count: 0, duration: 0 })
    }
  }

  onActivated(() => {
    if (scrollTop.value) {
      if (isMobile.value) {
        scrollToContainer({ count: scrollTop.value, duration: 0 })
      } else if (scrollRef.value) {
        scrollRef.value?.setScrollTop(scrollTop.value)
      }
    }
  })

  onDeactivated(() => {
    global.state.disabledScrollTop = true
    scrollTop.value = state.y
  })

  return {
    state,
    list,
    loading,
    pullRefresh,
    initLoading,
    scrollRef,
    contentHeight,
    openFloatBtn,
    scrollRoot: [ getScrollRoot(activeKey.value), 'relative' ],
    reloadList,
    handleScrollTop
  }
}
