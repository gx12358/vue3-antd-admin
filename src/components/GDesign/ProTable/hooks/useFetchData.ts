import type { ComputedRef } from 'vue'
import {
  ref,
  unref,
  computed,
  onUnmounted,
  onDeactivated,
  watch
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { getSortIndex, handleCurrentPage, runFunction } from '@/utils/util'
import { isFunction, isBoolean } from '@/utils/validate'
import type { ProTableProps } from '../'
import type { ProTablePagination, ProTabelFeachParams } from '../types/table'
import type { ProColumns } from '../types/column'
import useDebounceFn from '../hooks/useDebounceFn'

interface ActionType {
  getLoading: ComputedRef<boolean>;
  getPaginationInfo: ComputedRef<boolean | ProTablePagination>;
  setPagination: (info: Partial<ProTablePagination>) => void;
  setLoading: (loading: boolean) => void;
  setColumns: (columnList: Partial<ProColumns>) => void;
  removeRowKeys: (keyList: (string | number)[]) => void;
  columns: ComputedRef<ProColumns>;
  formParamsRef: RecordType;
  beforeSearchSubmit: ProTableProps['beforeSearchSubmit'];
}

export type ConfigFetchData = {
  polling: ComputedRef<ProTableProps['polling']>;
  request: ComputedRef<ProTableProps['request']>;
  postData: ComputedRef<ProTableProps['postData']>;
  waitRequest: ComputedRef<ProTableProps['waitRequest']>;
  debounceTime: ComputedRef<ProTableProps['debounceTime']>;
  dataSource: ComputedRef<ProTableProps['dataSource']>;
}

export function useConfigFetchData(props: ProTableProps): ConfigFetchData {
  const polling = computed(() => props.polling)
  const request = computed(() => props.request)
  const postData = computed(() => props.postData)
  const debounceTime = computed(() => props.debounceTime)
  const waitRequest = computed(() => props.waitRequest)
  const dataSource = computed(() => props.dataSource)

  return {
    polling,
    request,
    postData,
    debounceTime,
    waitRequest,
    dataSource
  }
}

export function useFetchData(
  {
    polling,
    request,
    postData,
    dataSource,
    waitRequest,
    debounceTime,
  }: ConfigFetchData,
  {
    columns,
    getLoading,
    setLoading,
    setColumns,
    removeRowKeys,
    formParamsRef,
    setPagination,
    getPaginationInfo,
    beforeSearchSubmit
  }: ActionType,
  emit: EmitType
) {

  const umountRef = ref<boolean>()
  const initial = ref<boolean>(true)
  const requesting = ref<boolean>(false)
  const pollingLoading = ref<boolean>(false)
  const dataSourceRef = ref<RecordType[]>([])
  const pollingSetTimeRef = ref<any>()

  const fetchListDebounce = useDebounceFn(
    async (info: any) => {
      if (pollingSetTimeRef.value) {
        clearTimeout(pollingSetTimeRef.value)
      }
      const msg = await fetchList(info)

      // 把判断要不要轮询的逻辑放到后面来这样可以保证数据是根据当前来
      // 放到请求前面会导致数据是上一次的
      const needPolling = runFunction(polling.value, msg)

      // 如果需要轮询，搞个一段时间后执行
      // 如果解除了挂载，删除一下
      if (needPolling && !umountRef.value) {
        pollingSetTimeRef.value = setTimeout(() => {
          fetchListDebounce.run({ ...info, isPolling: needPolling })
          // 这里判断最小要2000ms，不然一直loading
        }, Math.max(needPolling, 2000))
      }
    },
    debounceTime.value || 20
  )

  onUnmounted(() => {
    umountRef.value = true
    clearTimeout(pollingSetTimeRef.value)
  })

  onDeactivated(() => {
    umountRef.value = true
    clearTimeout(pollingSetTimeRef.value)
  })

  watch(() => polling.value, () => {
    if (!polling.value) {
      clearTimeout(pollingSetTimeRef.value)
    } else {
      fetchListDebounce.run({ isPolling: true })
    }
  }, { immediate: true })

  watch(
    () => [ waitRequest.value, dataSource.value, formParamsRef ],
    () => {
      if (request.value) {
        if ((!initial.value || !polling.value)) {
          fetchListDebounce.run({ isPolling: false })
        }
      } else {
        reSetDataList(dataSource.value || [])
      }
    }, {
      deep: true,
      immediate: true
    }
  )

  const getDataSourceRef = computed(() => {
    const viewColumns = unref(columns).filter((column) => column.show || column.show === undefined)
    if (
      !unref(dataSourceRef) ||
      unref(dataSourceRef).length === 0 ||
      !viewColumns ||
      viewColumns.length === 0
    ) {
      return []
    }

    return unref(dataSourceRef)
  })

  const isTreeDataRef = computed(() => unref(dataSourceRef)
    .some(item => item.children && item.children.length > 0))

  function setPollingLoading(loading: boolean) {
    pollingLoading.value = loading
  }

  function handleTableChange(pagination, filters, sorter) {
    fetchListDebounce.run({ pagination, filters, sorter, isPolling: false })
    emit('change', pagination, filters, sorter)
  }

  const setDataAndLoading = (dataList: RecordType[], pageInfo: RecordType) => {
    reSetDataList(dataList)
    setPagination(pageInfo)
  }

  const fetchList = async (info: ProTabelFeachParams = {}) => {
    const { pagination, filters, sorter, removeKeys = [], isPolling = false } = info

    if (!unref(request) || !isFunction(unref(request)) || (unref(waitRequest) && getLoading.value) || requesting.value)
      return dataSource.value || []
    requesting.value = true
    if (!isPolling || unref(waitRequest) || initial.value) {
      setLoading(true)
    } else {
      setPollingLoading(true)
    }
    if (unref(waitRequest)) {
      initial.value = false
      requesting.value = false
      return
    }
    const { current = 1, pageSize = 10, total } = unref(getPaginationInfo) as ProTablePagination || {}
    try {
      let pageParams: RecordType = {}
      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {}
      } else {
        pageParams.pageNum = handleCurrentPage(pagination || {
          current,
          pageSize,
          total
        } as any, removeKeys.length)

        if (removeKeys.length) removeRowKeys(removeKeys)

        pageParams.pageSize = pageSize
      }

      const columnKey = sorter?.columnKey || sorter?.field

      if (sorter && sorter.order) {
        setColumns(unref(columns).map(item => {
          if (item.dataIndex === columnKey) {
            item.sortOrder = sorter.order
          } else {
            item.sortOrder = null
          }
          return item
        }))
      } else if (sorter) {
        setColumns(unref(columns).map(item => {
          if (item.dataIndex === columnKey) item.sortOrder = null
          return item
        }))
      }

      let actionParams = {
        ...(pageParams || {}),
        ...info.params,
        ...formParamsRef
      }

      if (beforeSearchSubmit && isFunction(beforeSearchSubmit)) {
        actionParams = await beforeSearchSubmit(actionParams, sorter, filters)
      }

      let resultItems: RecordType[] = []

      const response = await unref(request)(actionParams, sorter, filters)
      requesting.value = false

      if (response && response.success) {
        resultItems = response.data
        if (unref(postData) && isFunction(unref(postData))) {
          resultItems = (await unref(postData)(resultItems)) || resultItems
        }
        setDataAndLoading(resultItems, {
          total: response.total || 0
        })
        return resultItems
      } else {
        return []
      }
    } catch (e) {
      if (dataSourceRef.value === undefined) reSetDataList([])
      emit('requestError', e)
    } finally {
      initial.value = false
      setLoading(false)
    }

    return []
  }

  function reSetDataList(list: RecordType[]) {
    dataSourceRef.value = getSortIndex(cloneDeep(list), unref(getPaginationInfo.value))
  }

  function changeDataValue({ key, value }: { key?: string, value: RecordType }) {
    dataSourceRef.value = dataSourceRef.value.map(item => {
      if (value[key] === item[key]) return { ...item, ...value }
      return item
    })
  }

  return {
    getDataSourceRef,
    isTreeDataRef,
    reSetDataList,
    changeDataValue,
    handleTableChange,
    reload: async (info?: any) => {
      if (unref(request))
        await fetchListDebounce.run({ ...info, isPolling: false })
      else
        emit('reload')
    }
  }
}
