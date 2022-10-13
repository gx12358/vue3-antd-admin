import { computed, defineComponent, nextTick, ref, unref, watch } from 'vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { Button, DatePicker, Form, Grid, Input, Select, Space, TreeSelect } from 'ant-design-vue'
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons-vue'
import { PropTypes } from '@/utils'
import { isArray } from '@/utils/validate'
import { useForm } from './useForm'
import type { ColConfig } from '../../types/table'
import type { ProSearchMap } from '../../types/column'
import { useTableContext } from '../../context/TableContext'
import { proTableProps } from '../../props'

import './style.less'

const { useBreakpoint } = Grid

const { MonthPicker, RangePicker, TimePicker } = DatePicker

export default defineComponent({
  props: {
    search: proTableProps.search,
    modal: proTableProps.modalScroll,
    searchMap: Array as PropType<ProSearchMap[]>,
    loading: PropTypes.bool,
    prefixCls: PropTypes.string,
    defaultParams: Object as PropType<RecordType>
  },
  emits: ['search'],
  setup(props, { emit, slots }) {
    const screens = useBreakpoint()

    const { setPagination } = useTableContext()
    const { formState, resetFormState, changeFormState } = useForm(
      props.defaultParams,
      props.searchMap
    )

    const advanced = ref(false)

    const hasSearch = computed(() => !!props.search.showSearch)
    const hasReset = computed(() =>
      props.search.showReset === undefined ? hasSearch.value : props.search.showReset
    )

    const responsiveArray: { value: Breakpoint; span: number }[] = [
      { value: 'xxl', span: 4 },
      { value: 'xl', span: 3 },
      { value: 'lg', span: 2 },
      { value: 'md', span: 2 },
      { value: 'sm', span: 2 },
      { value: 'xs', span: 1 }
    ]

    const rowLength = computed(() => getColSpanStyle(props.search.span))

    watch(
      () => props.search.defaultCollapsed,
      (value) => {
        advanced.value = advanced.value || value
      }
    )

    const getColSpanStyle = (colSpan: ColConfig) => {
      let span: number | string | undefined = 4

      // colSpan 响应式
      for (let i = 0; i < responsiveArray.length; i += 1) {
        const breakpoint: Breakpoint = responsiveArray[i].value
        if (screens.value[breakpoint]) {
          span = colSpan?.[breakpoint] || (props.modal ? 3 : responsiveArray[i].span)
          break
        }
      }

      return span as number
    }

    const changeAdvanced = (status: boolean) => {
      advanced.value = status
    }

    const getStyleWidth = (index, rowLength, rowWidth) => {
      return (index + 1) % rowLength === 0
        ? {
            ...rowWidth,
            marginRight: 0
          }
        : {
            ...rowWidth,
            marginRight: '2%'
          }
    }

    const handleChange = (value, record) => {
      switch (record.valueType) {
        case 'text':
          changeFormState(record.name, value || record.initialValue || '')
          break
        case 'select':
          changeFormState(
            record.name,
            value || value === 0 ? value : record.initialValue || undefined
          )
          break
        case 'treeSelect':
          changeFormState(
            record.name,
            value || value === 0
              ? value
              : record.initialValue ||
                  (record.fidle?.treeCheckable || record.field?.multiple ? [] : null)
          )
          break
        case 'date':
          changeFormState(
            record.name,
            value ? dayjs(value).format(record.format || 'YYYY-MM-DD') : record.initialValue || null
          )
          break
        case 'dateMonth':
          changeFormState(
            record.name,
            value ? dayjs(value).format('YYYY-MM') : record.initialValue || null
          )
          break
        case 'dateRange':
          changeFormState(
            record.name,
            value && value.length > 0
              ? [
                  dayjs(value[0]).format(record.format || 'YYYY-MM-DD'),
                  dayjs(value[1]).format(record.format || 'YYYY-MM-DD')
                ]
              : record.initialValue || null
          )
          break
        case 'time':
          changeFormState(
            record.name,
            value ? dayjs(value).format(record.format || 'HH:mm:ss') : record.initialValue || null
          )
          break
      }
      if (props.search.showSearch || record.valueType === 'text') {
        return
      } else if (record.valueType === 'treeSelect' || record.valueType === 'dateRange') {
        handleSubmit()
      } else {
        handleSubmit()
      }
    }

    const handleSubmit = (isManual?: boolean) => {
      nextTick(() => {
        const params: RecordType = cloneDeep(formState)
        const textRecord = props.searchMap.find((item) => item.valueType === 'text')
        const dateRangeRecord = props.searchMap.find((item) => item.valueType === 'dateRange')
        const treeSelectRecord = props.searchMap.find((item) => item.valueType === 'treeSelect')
        if (textRecord)
          params[textRecord.name] = formState[textRecord.name] || textRecord.initialValue || ''
        if (dateRangeRecord) {
          params[dateRangeRecord.rangeStartName || 'start'] = params[dateRangeRecord.name]
            ? params[dateRangeRecord.name][0]
            : ''
          params[dateRangeRecord.rangeEndName || 'end'] = params[dateRangeRecord.name]
            ? params[dateRangeRecord.name][1]
            : ''
          delete params[dateRangeRecord.name]
        }
        if (treeSelectRecord) {
          if (isArray(formState[treeSelectRecord.name])) {
            params[treeSelectRecord.name] = formState[treeSelectRecord.name].length
              ? formState[treeSelectRecord.name]
                  .map((item) => item[treeSelectRecord.valueKey === 'text' ? 'label' : 'value'])
                  .join()
              : ''
          }
          if (treeSelectRecord && isArray(params[treeSelectRecord.name])) {
            params[treeSelectRecord.name] = params[treeSelectRecord.name].length
              ? params[treeSelectRecord.name].map(
                  (item) => item[treeSelectRecord.valueKey === 'text' ? 'label' : 'value']
                )
              : ''
          }
        }
        if (!hasSearch.value || isManual) emit('search', params)
      })
    }

    const resetForm = () => {
      resetFormState()
      setPagination({
        current: 1
      })
      handleSubmit(true)
    }

    const optionRender = () =>
      (hasSearch.value || hasReset.value) && (
        <Space>
          {hasReset.value && (
            <Button onClick={() => resetForm()}>{props.search.resetText || '重置'}</Button>
          )}
          {hasSearch.value && (
            <Button loading={props.loading} type="primary" onClick={() => handleSubmit(true)}>
              {props.search.searchText || '查询'}
            </Button>
          )}
        </Space>
      )

    const AdvancedSlot = ({ formItemStyle, advanced, showAdvanced = true }) => (
      <div style={formItemStyle} class={`${unref(props.prefixCls)}-form-collapse-button`}>
        <Space size={16}>
          {optionRender()}
          {showAdvanced && (
            <a onClick={() => changeAdvanced(!advanced)}>
              {advanced ? '收起' : '展开'}
              {props.search.collapseRender ? (
                props.search.collapseRender()
              ) : advanced ? (
                <UpOutlined />
              ) : (
                <DownOutlined />
              )}
            </a>
          )}
        </Space>
      </div>
    )

    const FormItemContainer = (record) => {
      let show
      switch (record.valueType) {
        case 'text':
          show = (
            <Input.Search
              style={{ width: '100%' }}
              value={formState[record.name]}
              placeholder={record.placeholder || '请输入'}
              allowClear={
                record.allowClear || record.allowClear === false ? record.allowClear : true
              }
              enterButton={
                <a-button>
                  <SearchOutlined />
                </a-button>
              }
              onChange={(e) => handleChange(e.target.value, record)}
              onSearch={(_) => handleSubmit()}
            />
          )
          break
        case 'select':
          show = (
            <Select
              style={{ width: '100%' }}
              value={record.loading ? undefined : formState[record.name]}
              optionFilterProp="label"
              placeholder={record.placeholder || '请选择'}
              showSearch={record.showSearch}
              allowClear={
                record.allowClear || record.allowClear === false ? record.allowClear : true
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode
                }
                return trigger
              }}
              notFoundContent={
                record.loading === undefined ? undefined : record.loading ? (
                  <a-spin size="small" />
                ) : undefined
              }
              onChange={(e) => handleChange(e, record)}
            >
              {record.valueEnum.map((item) => (
                <a-select-option key={item.value} value={item.value}>
                  {item.text}
                </a-select-option>
              ))}
            </Select>
          )
          break
        case 'treeSelect':
          show = (
            <TreeSelect
              style={{ width: '100%' }}
              value={formState[record.name]}
              placeholder={record.placeholder || '请选择'}
              allowClear={
                record.allowClear || record.allowClear === false ? record.allowClear : true
              }
              treeData={record.valueEnum}
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode
                }
                return trigger
              }}
              notFoundContent={
                record.loading === undefined ? undefined : record.loading ? (
                  <a-spin size="small" />
                ) : undefined
              }
              onChange={(e) => handleChange(e, record)}
              {...(record.field || {})}
            />
          )
          break
        case 'date':
          show = (
            <DatePicker
              style={{ width: '100%' }}
              value={
                formState[record.name]
                  ? dayjs(formState[record.name], record.format || 'YYYY-MM-DD')
                  : null
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode as HTMLElement
                }
                return trigger
              }}
              placeholder={record.placeholder || '请选择'}
              allowClear={
                record.allowClear || record.allowClear === false ? record.allowClear : true
              }
              format={record.format || 'YYYY-MM-DD'}
              showTime={record.showTime}
              showToday={record.showToday || true}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'dateMonth':
          show = (
            <MonthPicker
              style={{ width: '100%' }}
              value={
                formState[record.name]
                  ? dayjs(formState[record.name], record.format || 'YYYY-MM')
                  : null
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode as HTMLElement
                }
                return trigger
              }}
              placeholder={record.placeholder || '请选择'}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'dateRange':
          show = (
            <RangePicker
              style={{ width: '100%' }}
              value={
                formState[record.name]?.length
                  ? [
                      dayjs(formState[record.name][0], record.format || 'YYYY-MM-DD HH:mm:ss'),
                      dayjs(formState[record.name][1], record.format || 'YYYY-MM-DD HH:mm:ss')
                    ]
                  : null
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode as HTMLElement
                }
                return trigger
              }}
              placeholder={record.placeholder || ['开始日期', '结束日期']}
              format={record.format || 'YYYY-MM-DD HH:mm:ss'}
              renderExtraFooter={record.renderExtraFooter || null}
              showTime={record.showTime}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
        case 'time':
          show = (
            <TimePicker
              style={{ width: '100%' }}
              value={
                formState[record.name]
                  ? dayjs(formState[record.name], record.format || 'HH:mm:ss')
                  : null
              }
              getPopupContainer={(trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode as HTMLElement
                }
                return trigger
              }}
              placeholder={record.placeholder || '请选择'}
              allowClear={
                record.allowClear || record.allowClear === false ? record.allowClear : true
              }
              use12Hours={record.use12Hours}
              format={record.format || 'HH:mm:ss'}
              renderExtraFooter={record.renderExtraFooter || null}
              onChange={(e) => handleChange(e, record)}
            />
          )
          break
      }
      return show
    }

    const FormItemWrapper = ({ formItemStyle, item }) => (
      <Form.Item style={formItemStyle}>
        {item.__v_isVNode ? item : FormItemContainer(item)}
      </Form.Item>
    )

    const FormItemRender = () => {
      const formNode = [...props.searchMap, ...slots.default?.()]

      return formNode.map((item, index) => {
        const rowWidth = {
          width: `${(100 - (rowLength.value - 1) * 2) / rowLength.value}%`
        }
        const formItemStyle = getStyleWidth(index, rowLength.value, rowWidth)

        if (formNode.length < rowLength.value || advanced.value) {
          return (
            <>
              {FormItemWrapper({ formItemStyle, item })}
              {index === formNode.length - 1 &&
                AdvancedSlot({
                  formItemStyle: {
                    flex: 1,
                    justifyContent: 'flex-end'
                  },
                  advanced: advanced.value,
                  showAdvanced: advanced.value
                })}
            </>
          )
        } else {
          return (
            <>
              {index < rowLength.value - 1 &&
                FormItemWrapper({
                  formItemStyle,
                  item
                })}
              {index === rowLength.value - 1 &&
                rowLength.value - 1 === 0 &&
                FormItemWrapper({
                  formItemStyle,
                  item
                })}
              {index === rowLength.value - 1 &&
                AdvancedSlot({
                  formItemStyle: {
                    flex: 1,
                    justifyContent: 'flex-end'
                  },
                  advanced: false,
                  showAdvanced: formNode.length >= rowLength.value
                })}
            </>
          )
        }
        return null
      })
    }

    return () => (
      <div
        class={{
          [`${unref(props.prefixCls)}-search`]: true,
          [`${props.search.className}`]: props.search.className
        }}
      >
        <Form class={`${unref(props.prefixCls)}-form`} layout="horizontal">
          <div class={`${unref(props.prefixCls)}-form-container`}>{FormItemRender()}</div>
        </Form>
      </div>
    )
  }
})
