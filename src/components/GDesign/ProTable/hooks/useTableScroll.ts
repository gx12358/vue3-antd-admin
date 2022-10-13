import type { ComputedRef, Ref } from 'vue'
import { unref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { TableProps } from '@gx-design/Table/typings'
import { isBoolean, isNumber, isString } from '@/utils/validate'
import type { ProTableProps } from '../'
import type { ProColumns } from '../types/column'

type ConfigScroll = {
  scroll: ComputedRef<ProTableProps['scroll']>;
  autoScroll: ComputedRef<ProTableProps['autoScroll']>;
  modalScroll: ComputedRef<ProTableProps['modalScroll']>;
  neverScroll: ComputedRef<ProTableProps['neverScroll']>;
  rowSelection: ComputedRef<ProTableProps['rowSelection']>;
  scrollBreakpoint: ComputedRef<ProTableProps['scrollBreakpoint']>;
}

type useTableScrollType = {
  columns: ComputedRef<ProColumns>;
  innerWidth: Ref<number>;
  screensRef: Ref<Partial<Record<Breakpoint, boolean>>>,
} & ConfigScroll

export function useConfigScroll(props: ProTableProps): ConfigScroll {
  const scroll = computed(() => props.scroll)
  const autoScroll = computed(() => props.autoScroll)
  const modalScroll = computed(() => props.modalScroll)
  const neverScroll = computed(() => props.neverScroll)
  const rowSelection = computed(() => props.rowSelection)
  const scrollBreakpoint = computed(() => props.scrollBreakpoint)

  return {
    scroll,
    neverScroll,
    rowSelection,
    autoScroll,
    modalScroll,
    scrollBreakpoint
  }
}

export function useTableScroll({
  scroll,
  columns,
  autoScroll,
  modalScroll,
  neverScroll,
  rowSelection,
  screensRef,
  innerWidth,
  scrollBreakpoint,
} : useTableScrollType) {
  const breakpoint: ComputedRef<boolean> = computed(() => {
    if (unref(scrollBreakpoint)) {
      return isNumber(unref(scrollBreakpoint))
        ? innerWidth.value > unref(scrollBreakpoint)
        : isString(unref(scrollBreakpoint))
          ? screensRef.value?.[unref(scrollBreakpoint)]
          : screensRef.value?.xl
    }
    return screensRef.value?.xl
  })

  const getScrollX = computed(() => {
    let width = 0
    const rowSelectWidth = unref(rowSelection) ? 60 : 0
    const NORMAL_WIDTH = 150
    const viewColumns = cloneDeep(unref(columns))
    viewColumns.forEach((item) => {
      width += Number.parseInt(item.width as string) || 0
    })
    const unsetWidthColumns = viewColumns.filter((item) => !Reflect.has(item, 'width'))

    const len = unsetWidthColumns.length
    if (len !== 0) {
      width += len * NORMAL_WIDTH
    }
    if (rowSelectWidth) width += rowSelectWidth
    return width
  })

  const getScrollRef = computed(() => {
    const { xl } = screensRef.value
    if (unref(neverScroll)) return {}
    if (unref(scroll) && Object.keys(unref(scroll)).length) return unref(scroll)
    if (unref(modalScroll)) {
      let modalScrollConfig: { x?: number | string; y?: number | string } = {
        y: (unref(scroll) as TableProps['scroll'])?.y || (xl ? 400 : 235)
      }
      return modalScrollConfig
    }
    if (!unref(autoScroll)) return {}
    return breakpoint.value
      ? {}
      : isBoolean(breakpoint.value) ? { x: unref(getScrollX) } : {}
  })

  return { getScrollRef, breakpoint }
}
