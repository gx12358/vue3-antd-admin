import type { ExtractPropTypes } from 'vue'
import {
  defineComponent,
  ref,
  toRef,
  unref,
  toRaw,
  onMounted,
  computed,
  onUnmounted,
  watchEffect,
  isVNode
} from 'vue'
import { cloneDeep, omit } from 'lodash-es'
import { useFullscreen } from '@vueuse/core'
import { Table, Grid, Spin, Pagination, Tooltip, Typography, TableProps } from 'ant-design-vue'
import Nodata from '@/assets/public_images/nodata.png'
import type { PaginationProps } from '@gx-design/Pagination/typings'
import { getPrefixCls, getSlotVNode } from '@gx-admin/utils'
import { warning } from '@gx-design/utils'
import { isObject } from '@/utils/validate'
import { getRandomNumber, hanndleField } from '@/utils/util'
import type { ProTablePaginationConfig, OptionConfig } from './types/table'
import type { ProColumns } from './types/column'
import { useLoading } from './hooks/useLoading'
import { useTableSize } from './hooks/useTableSize'
import { usePagination } from './hooks/usePagination'
import { useRowSelection } from './hooks/useRowSelection'
import { useFetchData, useConfigFetchData } from './hooks/useFetchData'
import { useTableForm } from './hooks/useTableForm'
import { useColumnSetting } from './hooks/useColumnSetting'
import { useColumns, useConfigColumns } from './hooks/useColums'
import { useTableScroll, useConfigScroll } from './hooks/useTableScroll'
import { provideTableContext } from './context/TableContext'
import Form from './components/Form'
import Toolbar from './components/ToolBar'
import { proTableProps } from './props'
import { proTableSlots, handleShowIndex } from './utils'

import './style.less'

export type ProTableProps = Partial<ExtractPropTypes<typeof proTableProps>>

const { useBreakpoint } = Grid

const defaultEmpty = (prefixCls: string) => (
  <div class={prefixCls}>
    <img style={{ width: '150px' }} src={Nodata} alt="" />
    <p class="text-hex-666666 text-base-15px">暂时没有数据哦~</p>
  </div>
)
const defaultOptions: OptionConfig = {
  reload: true,
  density: true,
  setting: true,
  fullScreen: true
}
const GProTable = defineComponent({
  name: 'GProTable',
  props: proTableProps,
  emits: [
    'reset',
    'reload',
    'submit',
    'sizeChange',
    'expandedRowsChange',
    'expand',
    'change',
    'requestError',
    'beforeSearchSubmit',
    'columnsStateChange',
    'loadingChange',
    'postData'
  ],
  setup(props, { emit, slots, attrs }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'table',
      isPor: true
    })
    const screens = useBreakpoint()

    const innerWidth = ref<number>(window.innerWidth)
    const tableRef = ref<any>()

    const { toggle, isFullscreen } = useFullscreen(tableRef)

    const getProps = computed<ProTableProps>(() => {
      return { ...props }
    })

    const needVirtualScroll = computed(() => {
      if (props.virtualScroll) {
        warning(!props.scroll?.y, '参数scroll的Y值不能为空！')
      }
      return props.scroll?.y && props.virtualScroll
    })

    const cacheColumns = computed(() => {
      const columsList: ProColumns = (props.columns || []).map((item) => {
        return {
          ...item,
          key: item.key || (item.dataIndex as string),
          align: item.align || props.align,
          uuid: getRandomNumber().uuid(15)
        }
      })
      return handleShowIndex(columsList, {
        align: props.align,
        showIndex: props.showIndex
      })
    })

    /**
     * @Author      gx12358
     * @DateTime    2022/1/21
     * @lastTime    2022/1/21
     * @description Tabel-loading hooks 方法
     */
    const { getLoading, setLoading } = useLoading({
      emit,
      loading: toRef(props, 'loading')
    })

    /**
     * @Author      gx12358
     * @DateTime    2022/1/21
     * @lastTime    2022/1/21
     * @description Tabel-size hooks 方法
     */
    const { sizeRef, setTableSize } = useTableSize({ emit, size: toRef(props, 'size') })

    /**
     * @Author      gx12358
     * @DateTime    2022/1/21
     * @lastTime    2022/1/21
     * @description Tabel-pagetion hooks 方法
     */
    const { getPaginationInfo, setPagination } = usePagination({
      slots,
      props: getProps,
      pagination: toRef(props, 'pagination')
    })

    /**
     * @Author      gx12358
     * @DateTime    2022/1/21
     * @lastTime    2022/1/21
     * @description Tabel-scroll hooks 方法
     */
    const configScroll = useConfigScroll(props)
    const { getScrollRef, breakpoint } = useTableScroll({
      ...configScroll,
      innerWidth,
      columns: cacheColumns,
      screensRef: screens
    })

    /**
     * @Author      gx12358
     * @DateTime    2022/1/21
     * @lastTime    2022/1/21
     * @description Tabel-colums hooks 方法
     */
    const configColums = useConfigColumns(props)
    const { getProColumns, cacheProColumns, setColumns, changeColumns, resizeColumnWidth } =
      useColumns({
        ...configColums,
        breakpoint,
        scroll: getScrollRef,
        columns: cacheColumns
      })

    /**
     * @Author      gx12358
     * @DateTime    2022/1/21
     * @lastTime    2022/1/21
     * @description Tabel-settingColums hooks 方法
     */
    const {
      columnsMap,
      operationType,
      setColumnsMap,
      sortKeyColumns,
      cacheColumnsMap,
      setSortKeyColumns
    } = useColumnSetting({
      columns: cacheProColumns,
      columnsState: toRef(props, 'columnsState'),
      changeColumns
    })

    /**
     * @Author      gx12358
     * @DateTime    2022/1/21
     * @lastTime    2022/1/21
     * @description Tabel-Form(搜索) hooks 方法
     */
    const { formDataRef, formParamsRef, defaultParamsRef, setFormParams } = useTableForm({
      search: toRef(props, 'search'),
      searchMap: toRef(props, 'searchMap'),
      params: toRef(props, 'params'),
      columns: cacheColumns
    })

    const { selectedKey, changeRowKey, selectRowKey, selectAllRowKey, removeRowKeys } =
      useRowSelection(toRef(props, 'rowKey'), toRef(props, 'rowSelection'))

    /**
     * @Author      gx12358
     * @DateTime    2022/1/21
     * @lastTime    2022/1/21
     * @description Tabel-datasource hooks 方法
     */
    const configFetchData = useConfigFetchData(props)
    const {
      reload,
      reSetDataList,
      changeDataValue,
      isTreeDataRef,
      getDataSourceRef,
      handleTableChange
    } = useFetchData(
      { ...configFetchData },
      {
        getLoading,
        getPaginationInfo,
        setPagination,
        removeRowKeys,
        setLoading,
        setColumns,
        columns: getProColumns,
        formParamsRef,
        beforeSearchSubmit: props.beforeSearchSubmit
      },
      emit
    )

    const getOptionsRef = computed(() => {
      if (props.options) {
        const propsOptions = cloneDeep(isObject(props.options) ? props.options : {})
        return {
          ...defaultOptions,
          ...propsOptions
        }
      }
      return {}
    })

    /**
     * @Author      gx12358
     * @DateTime    2021/7/16
     * @lastTime    2021/7/16
     * @description 获取pro-table内部方法
     */
    const getProTable = () => {
      props.actionRef({
        formParams: formParamsRef.value,
        pageParams: getPaginationInfo.value,
        reload: (info) => reload(info),
        reloadAndRest: () => reload({ current: 1, pageSize: 10 }),
        reSetDataList,
        changePageInfo: (pagination, filters, sorter) => changePage(pagination, filters, sorter),
        changeDataValue: ({ key, value }) => changeDataValue({ key, value }),
        loadingOperation: (loading) => setLoading(loading)
      })
    }

    watchEffect(() => {
      if (props.actionRef) getProTable()
    })

    onMounted(() => {
      window.addEventListener('resize', getWidth)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getWidth)
    })

    /**
     * @Author      gx12358
     * @DateTime    2021/12/22
     * @lastTime    2021/12/22
     * @description 监听屏幕宽度
     */
    const getWidth = () => {
      innerWidth.value = window.innerWidth
    }

    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格属性自适应
     */
    const getBindValues = computed(() => {
      const dataSource = unref(getDataSourceRef)
      let propsData: TableProps & {
        virtualScroll?: boolean
      } = {
        ...attrs,
        ...props,
        virtualScroll: needVirtualScroll.value,
        size: unref(sizeRef),
        scroll: unref(getScrollRef),
        loading: !!unref(getLoading),
        columns: toRaw(
          unref(getProColumns).filter((column) => column.show || column.show === undefined)
        ),
        pagination: toRaw(unref(getPaginationInfo)) as TableProps['pagination'],
        dataSource
      }

      propsData = omit(propsData, ['class', 'onChange', 'onExpand', 'onExpandedRowsChange'])
      return propsData
    })
    const proTableClassNames = computed(() => [
      {
        [`${baseClassName}`]: true,
        [`${attrs.class}`]: attrs.class,
        [`${props.tableClassName}`]: props.tableClassName,
        [`${baseClassName}-no-scroll`]: !Object.keys(getBindValues.value?.scroll || {}).length,
        [`${baseClassName}-table-tree`]: isTreeDataRef.value,
        [`${baseClassName}-full-screen`]: isFullscreen.value
      }
    ])

    provideTableContext({
      tableSize: sizeRef,
      columns: getProColumns,
      cacheColumns,
      action: {
        setTableSize,
        reload: (info) => reload(info),
        toggle
      },
      settingsAction: {
        autoScroll: toRef(props, 'autoScroll'),
        columnsMap,
        operationType,
        setColumnsMap,
        sortKeyColumns,
        cacheColumnsMap,
        setSortKeyColumns
      },
      setPagination,
      changeColumns,
      slots
    })

    const handleSlots = (children) => {
      const tableSlots = {}
      Object.keys(children).map((item) => {
        if (!proTableSlots.includes(item)) {
          tableSlots[item] = children[item]
        }
        return item
      })
      return tableSlots
    }

    const handlePagePosition = computed(() => {
      const defaultPosition = unref(getProps).direction === 'rtl' ? 'left' : 'right'
      let position = (unref(getPaginationInfo) as ProTablePaginationConfig)?.position
      if (position !== null && Array.isArray(position)) {
        const topPos = position.find((p) => p.indexOf('top') !== -1)
        const bottomPos = position.find((p) => p.indexOf('bottom') !== -1)
        const isDisable = position.every((p) => `${p}` === 'none')
        if (!topPos && !bottomPos && !isDisable) {
          position = defaultPosition
        }
        if (topPos) {
          position = topPos!.toLowerCase().replace('top', '')
        }
        if (bottomPos) {
          position = bottomPos!.toLowerCase().replace('bottom', '')
        }
      } else {
        position = defaultPosition
      }
      return position
    })

    const handleTableSearch = (params: RecordType) => {
      if (props.search.showSearch) {
        setFormParams({ ...params, ...((props.params || {}) as RecordType) })
        reload()
      } else {
        setFormParams(params)
      }
    }

    const handleTableSubmit = (params: RecordType, reset?: boolean) => {
      if (reset) {
        emit('reset', params)
        if (props.request) {
          handleTableSearch(params)
        }
      } else if (props.request) {
        emit('submit', params)
        handleTableSearch(params)
      } else {
        emit('submit', params)
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description ant-table原始方法
     */
    const changePage = async (pagination: Partial<PaginationProps>, filters, sorter) => {
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize
      })
      handleTableChange(pagination, filters, sorter)
    }

    const handleChangePage = (page, pageSize) => {
      setPagination({
        current: page,
        pageSize: pageSize
      })
      handleTableChange(
        {
          current: page,
          pageSize: pageSize,
          total: unref(getPaginationInfo)['total'] || (0 as number)
        },
        false,
        false
      )
    }

    const expandedRowsChange = (expandedRows) => {
      emit('expandedRowsChange', expandedRows)
    }
    const expand = (expanded, record) => {
      emit('expand', expanded, record)
    }
    const handleResizeColumn = (w, col) => resizeColumnWidth(w, col)
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格字段溢出提示
     */
    const tooltipSlot = (value, success, record) => {
      let show = value
      const placement =
        record.align === 'center'
          ? 'top'
          : record.align === 'left' || !record.align
          ? 'topLeft'
          : 'topRight'
      if (success && record.copyable) {
        show = (
          <Typography.Paragraph
            class={`${baseClassName}-copyable`}
            style={{ margin: '0', width: '100%', padding: '0' }}
            copyable
          >
            <Tooltip title={value} placement={placement}>
              <div class={`${baseClassName}-ellipsis`}>{value}</div>
            </Tooltip>
          </Typography.Paragraph>
        )
      } else if (success && !record.copyable) {
        show = (
          <Tooltip title={value} placement={placement}>
            {isTreeDataRef.value ? value : <div class={`${baseClassName}-ellipsis`}>{value}</div>}
          </Tooltip>
        )
      }
      return show
    }

    const toolbarDom = (headerTitle, toolBarBtn, titleTip) => (
      <Toolbar
        headerTitle={headerTitle}
        titleTip={titleTip}
        titleTipText={props.titleTipText}
        options={unref(getOptionsRef)}
        settingExtra={getSlotVNode(slots, props, 'settingExtra')}
        optionsExtra={getSlotVNode(slots, props, 'optionsExtra')}
        toolBarBtn={toolBarBtn}
      />
    )

    return () => {
      const headerTitleRender = getSlotVNode(slots, props, 'headerTitle')
      const titleTipRender = getSlotVNode(slots, props, 'titleTip')
      const toolBarBtnRender = getSlotVNode(slots, props, 'toolBarBtn')
      const customizeRender = getSlotVNode(slots, props, 'customize')

      return (
        <div
          ref={(e) => (tableRef.value = e)}
          style={props.tableStyle || null}
          class={proTableClassNames.value}
        >
          <div class="gx-pro-table-content">
            {(!!formDataRef.value.length || !!slots.search?.()) && (
              <Form
                search={props.search}
                modal={props.modalScroll}
                searchMap={formDataRef.value}
                prefixCls={baseClassName}
                loading={!!unref(getLoading)}
                onSearch={handleTableSubmit}
                defaultParams={defaultParamsRef}
                v-slots={{
                  default: () => slots.search?.()
                }}
              />
            )}
            {!needVirtualScroll.value &&
              toolbarDom(headerTitleRender, toolBarBtnRender, titleTipRender)}
            {customizeRender ? (
              <Spin spinning={!!unref(getLoading)}>
                {props.customize
                  ? props.customize(unref(getDataSourceRef))
                  : slots.customize(unref(getDataSourceRef))}
                <Pagination
                  class={{
                    ['ant-table-pagination']: true,
                    [`ant-table-pagination-${handlePagePosition.value}`]: handlePagePosition.value
                  }}
                  {...toRaw(unref(getPaginationInfo))}
                  onChange={handleChangePage}
                />
              </Spin>
            ) : (
              <Table
                {...getBindValues.value}
                rowKey={(record) => record[props.rowKey || 'sortIndex']}
                transformCellText={({ text, column }) => {
                  if (isVNode(text)) return text
                  const { value, success } = hanndleField(
                    text,
                    (column as any)?.columnEmptyText || props?.columnEmptyText
                  )
                  return (column as any)?.ellipsis
                    ? tooltipSlot(value, success, column as ProColumns)
                    : value
                }}
                rowSelection={
                  props.rowSelection
                    ? {
                        ...omit(
                          props.rowSelection,
                          'onSelect',
                          'onSelectAll',
                          'onChange',
                          'selectedRowKeys'
                        ),
                        selectedRowKeys: selectedKey.value,
                        onSelect: selectRowKey,
                        onSelectAll: selectAllRowKey,
                        onChange: changeRowKey
                      }
                    : undefined
                }
                onChange={changePage}
                onExpandedRowsChange={expandedRowsChange}
                onExpand={expand}
                onResizeColumn={handleResizeColumn}
                v-slots={{
                  emptyText: () => defaultEmpty(`${baseClassName}-empty`),
                  ...handleSlots(slots)
                }}
              />
            )}
          </div>
        </div>
      )
    }
  }
})

export default GProTable
