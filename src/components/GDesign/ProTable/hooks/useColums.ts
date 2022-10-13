import { unref, computed, ref, Ref, ComputedRef, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { TableProps } from '@gx-design/Table/typings'
import { compareToMax } from '@/utils/util'
import { isBoolean, isNumber } from '@/utils/validate'
import type { ColumnsState } from './useColumnSetting'
import type { ProTableProps } from '../'
import type { ProColumn, ProColumns } from '../types/column'

export type ConfigColumns = {
  draggabled: ComputedRef<ProTableProps['draggabled']>;
  neverScroll: ComputedRef<ProTableProps['neverScroll']>;
  autoScroll: ComputedRef<ProTableProps['autoScroll']>;
}

type UseColumnsType = {
  scroll: ComputedRef<ProTableProps['scroll']>;
  breakpoint: ComputedRef<boolean>;
  columns: ComputedRef<ProColumns>;
} & ConfigColumns

export function useConfigColumns(props: ProTableProps): ConfigColumns {
  const draggabled = computed(() => props.draggabled)
  const neverScroll = computed(() => props.neverScroll)
  const autoScroll = computed(() => props.autoScroll)

  return {
    draggabled,
    neverScroll,
    autoScroll
  }
}

export function useColumns({
  scroll,
  columns,
  breakpoint,
  draggabled,
  autoScroll,
  neverScroll
}: UseColumnsType) {

  const proColumnsRef: Ref<ProColumns> = ref([])
  const cacheProColumns: Ref<ProColumns> = ref([])

  watch([
    () => scroll.value,
    () => columns.value,
    () => breakpoint.value,
    () => draggabled.value,
    () => autoScroll.value,
    () => neverScroll.value
  ], () => {
    proColumnsRef.value = cloneDeep(handleColumns(unref(columns)))
    cacheProColumns.value = cloneDeep(handleColumns(unref(columns)))
  }, {
    deep: true,
    immediate: true,
  })

  const getProColumns = computed(() => {
    const leftColumnsData = handleTableSort(unref(proColumnsRef).filter(item => item.fixed === 'left'))
    const middleColumnsData = handleTableSort(unref(proColumnsRef).filter(item => item.fixed !== 'left' && item.fixed !== 'right'))
    const rightColumnsData = handleTableSort(unref(proColumnsRef).filter(item => item.fixed === 'right'))

    return [
      ...leftColumnsData,
      ...middleColumnsData,
      ...rightColumnsData
    ]
  })

  function handleTableSort(data) {
    return data.sort((a, b) => compareToMax(a, b, 'order'))
  }

  function handleColumns(columnsList: ProColumn[]) {
    return cloneDeep(columnsList).map((item, index) => {
      if (item.dataIndex === 'action' || index === (columnsList.length - 1)) {
        item.resizable = false
      } else {
        item.resizable = isBoolean(item.resizable)
          ? item.resizable
          : (isNumber(item.width) && unref(draggabled)
            ? true : false)
      }
      if (!item.width || unref(neverScroll)) return item
      if (item.dataIndex === 'action' && unref(autoScroll)) {
        if ((unref(scroll) as TableProps['scroll'])?.x || !unref(breakpoint)) {
          item.width = item.width || 100
          item.fixed = 'right'
        } else {
          const originCol = unref(columns).find(col =>
            col.dataIndex === item.dataIndex)
          item.width = originCol?.width || ''
          item.fixed = originCol?.fixed
        }
      }
      return item
    })
  }

  function resizeColumnWidth(w, col: any) {
    proColumnsRef.value = proColumnsRef.value.map(item => {
      if (item.uuid === col.uuid) {
        item.width = w
      }
      return item
    })
  }

  function setColumns(columnList) {
    if (columnList.length <= 0) {
      proColumnsRef.value = []
      return
    }

    proColumnsRef.value = handleColumns(cloneDeep(columnList))
  }

  function changeColumns(columnState: Record<string, ColumnsState>) {
    let columnsList: ProColumn[] = cloneDeep(columns.value)
    columnsList = columnsList.map((item) => {
      return {
        ...item,
        show: columnState[item.key]?.show,
        fixed: columnState[item.key]?.fixed,
        order: columnState[item.key]?.order
      }
    })
    setColumns(columnsList)
  }

  return {
    breakpoint,
    getProColumns,
    cacheProColumns,
    setColumns,
    changeColumns,
    resizeColumnWidth
  }
}
