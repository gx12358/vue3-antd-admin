import type { Dayjs } from 'dayjs'
import { defaultSettings } from '@gx-config'
import { getRandomNumber, isFunction, isNumber, isObject, scrollTo } from '@gx-design-vue/pro-utils'
import dayjs from 'dayjs'
import { h } from 'vue'
import { isDev, typeViteEnv } from '@/utils/env'

export interface NumberToShow {
  numberValue: string;
  unitStr: string;
  joinStr: string;
}

const { viewScrollRoot } = defaultSettings.system

export async function asyncRunSafe<T = any>(fn: Promise<T>): Promise<[Error] | [null, T]> {
  try {
    return [null, await fn]
  }
  catch (e: any) {
    return [e || new Error('unknown error')]
  }
}

export async function fetchWithRetry<T = any>(fn: Promise<T>, retries = 3): Promise<[Error] | [null, T]> {
  const [error, res] = await asyncRunSafe(fn)
  if (error) {
    if (retries > 0) {
      const res = await fetchWithRetry(fn, retries - 1)
      return res
    }
    else {
      if (error instanceof Error)
        return [error]
      return [new Error('unknown error')]
    }
  }
  else {
    return [null, res]
  }
}

export const TransformVNode = (props: { node: any; class?: string }) => {
  return h(isFunction(props.node) ? props.node?.(props.class) : props.node)
}

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20
    ? '下午好'
    : '晚上好'
}

/**
 * 计算元素相对于页面顶部的偏移距离
 * @param element - 需要计算偏移的DOM元素
 * @returns 包含top属性的对象，表示元素相对于页面顶部的距离
 */
export function handleOffsetTop(element?: HTMLElement) {
  let top = 0

  if (element) {
    let currentElement: HTMLElement | null = element
    // 遍历元素及其所有父元素，累加offsetTop值
    while (currentElement) {
      top += currentElement.offsetTop
      currentElement = currentElement.offsetParent as HTMLElement | null
    }
  }
  return { top }
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/7/23
 * @lastTime    2020/7/23
 * @description 去除空格
 */
export function trim(str: string, isGlobal?: boolean) {
  if (typeof str === 'undefined' || str.length === 0)
    return ''
  let result
  result = str.replace(/(^\s+)|(\s+$)/g, '')
  if (isGlobal) {
    result = result.replace(/\s/g, '')
  }
  return result
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
export function paramObj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(`{"${decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"')
    .replace(/\+/g, ' ')}"}`)
}

/**
 * @Author      gx12358
 * @DateTime    2021/11/3
 * @lastTime    2021/11/3
 * @description get参数处理
 */
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && typeof (value) !== 'undefined' && value !== '') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof (value[key]) !== 'undefined') {
            const params = propName + '[' + key + ']'
            const subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

/**
 * @Author      gx12358
 * @DateTime    2022/10/11
 * @lastTime    2022/10/11
 * @description 滚动到固定位置
 */
export function scrollToContainer(options: { count: number; root?: string; duration?: number }) {
  if (!isObject(options))
    return
  scrollTo(options.count || 0, {
    getContainer: () => document.querySelector(options?.root || viewScrollRoot) as HTMLInputElement,
    duration: options?.duration || 450
  })
}

export function scrollTargetEl(target: string) {
  const scrollContainer = document.querySelector(viewScrollRoot)
  const targetElement = document.querySelector(target)
  if (targetElement && scrollContainer) {
    // 获取目标元素相对于滚动容器的位置
    const rect = targetElement.getBoundingClientRect()
    const containerRect = scrollContainer.getBoundingClientRect()
    // 计算目标元素相对于滚动容器的偏移量
    const offsetTop = rect.top - containerRect.top + scrollContainer.scrollTop
    scrollToContainer({
      count: offsetTop - 88,
      duration: 450
    })
  }
}

/**
 * @Author      gx12358
 * @DateTime    2022/6/20
 * @lastTime    2022/6/20
 * @description 转换数字
 */
export function toConvertNumberShow(
  number: number,
  options?: { toChinese?: boolean; fixed?: number; showStr?: boolean; unit?: string; }
): NumberToShow {
  const fixedNum = options?.fixed || 2
  const unitStr = options?.unit || (
    options?.showStr === undefined || options?.showStr
      ? options?.toChinese === undefined || options?.toChinese
        ? number < 100000000 ? '万' : '亿'
        : number < 100000000 ? 'w' : 'e'
      : ''
  )
  if (!isNumber(number) || options?.unit) {
    return {
      numberValue: `${number}`,
      unitStr,
      joinStr: `${number}${unitStr}`
    }
  }
  if (number < 10000) {
    return {
      numberValue: `${number}`,
      unitStr,
      joinStr: `${number}${unitStr}`
    }
  }

  if (options?.fixed) {
    const numStr = (number / (number < 100000000 ? 10000 : 100000000)).toFixed(1).split('.')[0]
    const numFixed = (number / (number < 100000000 ? 10000 : 100000000)).toFixed(1).split('.')[1]

    if (numFixed === '0') {
      return {
        numberValue: `${numStr}`,
        unitStr,
        joinStr: `${numStr}${unitStr}`
      }
    }
  }
  const match = fixedNum === 1 ? /^\d+(?:\.\d?)?/ : /^\d+(?:\.\d{0,2})?/
  const numberValue = number < 100000000 ? number / 10000 : number / 100000000

  return {
    numberValue: `${(numberValue).toString().match(match)}`,
    unitStr,
    joinStr: `${(numberValue).toString().match(match)}${unitStr}`
  }
}

/**
 * @Author      gx12358
 * @DateTime    2022/8/4
 * @lastTime    2022/8/4
 * @description 数字转中文
 */
export function toChinesNum(num: number) {
  num = num || 0
  const changeNum = [ '零', '一', '二', '三', '四', '五', '六', '七', '八', '九' ]
  const unit = [ '', '十', '百', '千', '万' ]
  num = Number.parseInt(`${num}`)
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (let i = 0; i < strArr.length; i++) {
      newNum = (i === 0 && strArr[i] === '0'
        ? ''
        : i > 0 && strArr[i] === '0' && strArr[i - 1] === '0'
          ? ''
          : (num < 20 && i > 0 ? '' : changeNum[strArr[i]]) + (strArr[i] === '0'
          ? unit[0]
          : unit[i])) + newNum
    }
    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan: any = num % 10000
  if (noWan.toString().length < 4) {
    noWan = '0' + noWan
  }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}

export function treeAntDataNode<T = any, D = SystemDataNode>(
  data: T[],
  fieldNames?: { value?: keyof T; label?: keyof T; children?: keyof T }
): D[] {
  const value = fieldNames?.value || 'id'
  const label = fieldNames?.label || 'label'
  const children = fieldNames?.children || 'children'
  return data.map((item: any) => {
    return {
      ...item,
      id: item[value],
      key: item[value],
      value: item[value],
      label: item[label],
      title: item[label],
      children: item[children] && item[children].length > 0 ? treeAntDataNode(item[children], fieldNames) : []
    }
  })
}

// 日期格式化
export function parseTime(time, pattern?: string) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^\d+$/.test(time))) {
      time = Number.parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/g), '/').replace('T', ' ').replace(new RegExp(/\.\d{3}/g), '')
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/\{([ymdhisa])+\}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return [ '日', '一', '二', '三', '四', '五', '六' ][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export async function copyToClipboard(text: string) {
  try {
    return navigator.clipboard.writeText(text)
  } catch {
    const element = document.createElement('textarea')
    const previouslyFocusedElement = document.activeElement

    element.value = text

    // Prevent keyboard from showing on mobile
    element.setAttribute('readonly', '')

    element.style.contain = 'strict'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.fontSize = '12pt' // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection
      ? selection.rangeCount > 0 && selection.getRangeAt(0)
      : null

    document.body.appendChild(element)
    element.select()

    // Explicit selection workaround for iOS
    element.selectionStart = 0
    element.selectionEnd = text.length

    document.execCommand('copy')
    document.body.removeChild(element)

    if (originalRange) {
      selection!.removeAllRanges() // originalRange can't be truthy when selection is falsy
      selection!.addRange(originalRange)
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      ;(previouslyFocusedElement as HTMLElement).focus()
    }
  }
}

export function disabledDate(current: Dayjs) {
  return (current && current <= dayjs().subtract(1, 'day').endOf('day'))
}

export function downloadFile(fileUrl, fileName?: string) {
  // 如果浏览器支持 HTML5 的下载功能（即存在 download 属性）
  const link = document.createElement('a')

  // 设置文件的 URL 和文件名
  link.href = fileUrl
  if (fileName) {
    link.download = fileName
  }

  // 模拟点击链接以开始下载
  link.click()
}

export function amountUnit(str: string | number | undefined, {
  unit,
  checkNill = true,
  defaultValue = '无'
}: {
  unit?: string
  checkNill?: boolean
  defaultValue?: string
}) {
  if (checkNill ? str : true) return `${str || 0}${unit}`
  return defaultValue
}

export function getDownloadUrl(url: string) {
  const page = isDev() ? typeViteEnv('VITE_HOME_PAGE') : ''
  const baseUrl = `${page}${typeViteEnv('VITE_BASE_URL')}/profile/download/`

  return baseUrl + url
}

export function handleRandomImage(width = 50, height = 50) {
  return `https://picsum.photos/${width}/${height}?random=${getRandomNumber().uuid(10)}`
}
