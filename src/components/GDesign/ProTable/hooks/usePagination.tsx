import { computed, unref, reactive, watchEffect, Ref, Slots, ComputedRef } from 'vue'
import { getSlot } from '@gx-admin/utils'
import type { PageItemRender } from '@gx-design/Table/typings'
import type { PaginationProps } from '@gx-design/Pagination/typings'
import { isBoolean, isFunction } from '@/utils/validate'
import type { ProTableProps } from '../Table'
import type { ProTablePagination, ProTablePaginationConfig } from '../types/table'

export function usePagination({
  slots,
  props,
  pagination
}: {
  slots: Slots
  props: ComputedRef<ProTableProps>
  pagination: Ref<ProTableProps['pagination']>
}) {
  const configRef = reactive<PaginationProps>({})

  watchEffect(() => {
    if (pagination.value || pagination.value === undefined) {
      Object.assign(configRef, { ...(pagination.value ?? {}) })
    } else {
      for (const key in configRef) delete configRef[key]
    }
  })

  const getPaginationInfo = computed((): ProTablePagination => {
    if (isBoolean(pagination.value) && !pagination.value) {
      return false
    }

    const pageItemRender = getSlot<PageItemRender>(slots, unref(props), 'pageItemRender')
    const itemRenderProps = isFunction(pageItemRender)
      ? {
          itemRender: ({
            page,
            type,
            originalElement
          }: {
            page: number
            type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next'
            originalElement: any
          }) => (pageItemRender ? pageItemRender({ page, type, originalElement }) : null)
        }
      : null

    const pageInfo: ProTablePaginationConfig = {
      current: 1,
      pageSize: 10,
      size: 'normal',
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      ...(pagination.value || {}),
      ...unref(configRef),
      ...(itemRenderProps || {})
    }

    if (!pagination.value?.showTotal) {
      pageInfo.showTotal = (total) =>
        `共${total < pageInfo.pageSize ? 1 : Math.ceil(total / pageInfo.pageSize)}页 ${total}条记录`
    }
    return pageInfo
  })

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo)
    Object.assign(configRef, {
      ...((paginationInfo as ProTablePagination) || {}),
      ...info
    })
  }

  return { getPaginationInfo, setPagination }
}
