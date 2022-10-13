import type { ProSearchMap } from '../types/column'
import { ProColumns } from '../types/column'
import { AlignType } from '@gx-design/Table/typings'
import { getRandomNumber } from '@/utils/util'
import { cloneDeep } from 'lodash-es'

export const proTableSlots: string[] = [
  'search',
  'headerTitle',
  'toolBarBtn',
  'titleTip',
  'settingExtra',
  'optionsExtra',
  'pageItemRender',
  'customize'
]

/**
 * 根据 key 和 dataIndex 生成唯一 id
 *
 * @param key 用户设置的 key
 * @param dataIndex 在对象中的数据
 * @param index 序列号，理论上唯一
 */
export const genColumnKey = (key?: string | number | undefined, index?: number): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString()
  }
  return `${index}`
}

export function handleShowIndex(
  columns: ProColumns,
  {
    align,
    showIndex
  }: {
    align: AlignType;
    showIndex: boolean;
  }
) {
  const columnsList = cloneDeep(columns)
  if (showIndex && columns.length && columns.every(column => column.dataIndex !== 'sortIndex')) {
    const firstColumsItem = columns[0]
    columnsList.unshift({
      title: '序号',
      align,
      fixed: firstColumsItem.fixed,
      width: 60,
      uuid: getRandomNumber().uuid(15),
      dataIndex: 'sortIndex',
      key: 'sortIndex'
    })
  } else {
    columnsList.filter(item => item.dataIndex !== 'sortIndex')
  }
  return columnsList
}

export function handleFormDefaultValue(data: ProSearchMap[]) {
  const defaultParams = {}
  data.map(item => {
    let initialValue = item.initialValue
    const valueUndefined = [ 'select' ]
    const valueNull = [ 'date', 'time', 'dateRange' ]
    if (!initialValue && valueUndefined.includes(item.valueType)) {
      initialValue = undefined
    } else if (!initialValue && valueNull.includes(item.valueType)) {
      initialValue = null
    } else if (!initialValue) {
      initialValue = ''
    }
    if (item.name === 'dateRange') {
      defaultParams[item.rangeStartName || 'start'] = initialValue ? initialValue[0] : null
      defaultParams[item.rangeEndName || 'end'] = initialValue ? initialValue[1] : null
    } else {
      defaultParams[item.name] = initialValue
    }
    return item
  })
  return defaultParams
}
