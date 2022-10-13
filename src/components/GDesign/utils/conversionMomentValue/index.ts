import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { InternalNamePath, NamePath } from 'ant-design-vue/lib/form/interface'
import { get } from '../index'
import isNil from '../isNil'
import type { ProFieldValueType } from '../typings'

type DateFormatter = 'number' | 'string' | false;

export const dateFormatterMap = {
  time: 'HH:mm:ss',
  timeRange: 'HH:mm:ss',
  date: 'YYYY-MM-DD',
  dateWeek: 'YYYY-wo',
  dateMonth: 'YYYY-MM',
  dateQuarter: 'YYYY-QQ',
  dateYear: 'YYYY',
  dateRange: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:ss',
  dateTimeRange: 'YYYY-MM-DD HH:mm:ss'
}

function isObject(o: any) {
  return Object.prototype.toString.call(o) === '[object Object]'
}

export function isPlainObject(o: { constructor: any }) {
  if (isObject(o) === false) return false

  // If has modified constructor
  const ctor = o.constructor
  if (ctor === undefined) return true

  // If has modified prototype
  const prot = ctor.prototype
  if (isObject(prot) === false) return false

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false
  }

  // Most likely a plain Object
  return true
}

/**
 * 根据不同的格式转化 dayjs
 *
 * @param value
 * @param dateFormatter
 * @param valueType
 */
const convertMoment = (value: Dayjs, dateFormatter: string | false, valueType: string) => {
  if (!dateFormatter) {
    return value
  }
  if (dayjs.isDayjs(value)) {
    if (dateFormatter === 'number') {
      return value.valueOf()
    }
    if (dateFormatter === 'string') {
      return value.format(dateFormatterMap[valueType] || 'YYYY-MM-DD HH:mm:ss')
    }
    if (typeof dateFormatter === 'string' && dateFormatter !== 'string') {
      return value.format(dateFormatter)
    }
  }
  return value
}

/**
 * 这里主要是来转化一下数据 将 dayjs 转化为 string 将 all 默认删除
 *
 * @param value
 * @param dateFormatter
 * @param proColumnsMap
 */
const conversionMomentValue = <T = any>(
  value: T,
  dateFormatter: DateFormatter,
  valueTypeMap: Record<string,
    | {
    valueType: ProFieldValueType;
    dateFormat: string;
  }
    | any>,
  omitNil?: boolean,
  parentKey?: NamePath
): T => {
  const tmpValue = {} as T
  if (typeof window === 'undefined') return value
  // 如果 value 是 string | null | Blob类型 其中之一，直接返回
  // 形如 {key: [File, File]} 的表单字段当进行第二次递归时会导致其直接越过 typeof value !== 'object' 这一判断 https://github.com/ant-design/pro-components/issues/2071
  if (typeof value !== 'object' || isNil(value) || value instanceof Blob || Array.isArray(value)) {
    return value
  }
  Object.keys(value).forEach((key) => {
    const namePath: InternalNamePath = parentKey ? ([
      parentKey,
      key
    ].flat(1) as string[]) : [ key ]
    const valueFormatMap = get(valueTypeMap, namePath) || 'text'

    let valueType: ProFieldValueType = 'text'
    let dateFormat: string | undefined
    if (typeof valueFormatMap === 'string') {
      valueType = valueFormatMap as ProFieldValueType
    } else if (valueFormatMap) {
      valueType = valueFormatMap.valueType
      dateFormat = valueFormatMap.dateFormat
    }
    const itemValue = value[key]
    if (isNil(itemValue) && omitNil) {
      return
    }
    // 处理嵌套的情况
    if (
      isPlainObject(itemValue) &&
      // 不是数组
      !Array.isArray(itemValue) &&
      // 不是 dayjs
      !dayjs.isDayjs(itemValue)
    ) {
      tmpValue[key] = conversionMomentValue(
        itemValue,
        dateFormatter,
        valueTypeMap,
        omitNil,
        [ key ]
      )
      return
    }
    // 处理 FormList 的 value
    if (Array.isArray(itemValue)) {
      tmpValue[key] = itemValue.map((arrayValue, index) => {
        if (dayjs.isDayjs(arrayValue)) {
          return convertMoment(arrayValue, dateFormat || dateFormatter, valueType)
        }
        return conversionMomentValue(arrayValue, dateFormatter, valueTypeMap, omitNil, [
          key,
          `${index}`
        ])
      })
      return
    }
    tmpValue[key] = convertMoment(itemValue, dateFormat || dateFormatter, valueType)
  })

  return tmpValue
}

export default conversionMomentValue
