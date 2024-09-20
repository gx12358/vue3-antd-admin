import { defaultSettings } from '@gx-config'
import { isFunction, isNumber, isObject, scrollTo } from '@gx-design-vue/pro-utils'
import { h } from 'vue'

export interface NumberToShow {
  numberValue: string;
  countStr: string;
  joinStr: string;
}

const { viewScrollRoot } = defaultSettings

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
 * @description 判断元素到上一个元素的距离
 */
export function handleOffsetTop(targetNode: HTMLInputElement) {
  let totalLeft = 0
  let totalTop = 0
  if (!targetNode)
    return { left: totalLeft, top: totalTop }
  let parentNode = <HTMLElement>targetNode.offsetParent
  // 首先把自己本身的相加
  totalLeft += targetNode.offsetLeft
  totalTop += targetNode.offsetTop
  // 现在开始一级一级往上查找，只要没有遇到body，我们就把父级参照物的边框和偏移相加
  while (parentNode) {
    if (navigator.userAgent.includes('MSIE 8.0')) {
      // 不是IE8我们才进行累加父级参照物的边框
      totalTop += parentNode.clientTop
      totalLeft += parentNode.clientLeft
    }
    // 把父级参照物的偏移相加
    totalTop += parentNode.offsetTop
    totalLeft += parentNode.offsetLeft
    parentNode = <HTMLElement>parentNode.offsetParent
  }
  return { left: totalLeft, top: totalTop }
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
    duration: options?.duration || 200
  })
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
  const countStr = options?.unit || (
    options?.showStr === undefined || options?.showStr
      ? options?.toChinese === undefined || options?.toChinese
        ? number < 100000000 ? '万' : '亿'
        : number < 100000000 ? 'w' : 'e'
      : ''
  )
  if (!isNumber(number) || options?.unit) {
    return {
      numberValue: `${number}`,
      countStr,
      joinStr: `${number}${countStr}`
    }
  }
  if (number < 10000) {
    return {
      numberValue: `${number}`,
      countStr,
      joinStr: `${number}${countStr}`
    }
  }

  if (options?.fixed) {
    const numStr = (number / (number < 100000000 ? 10000 : 100000000)).toFixed(1).split('.')[0]
    const numFixed = (number / (number < 100000000 ? 10000 : 100000000)).toFixed(1).split('.')[1]

    if (numFixed === '0') {
      return {
        numberValue: `${numStr}`,
        countStr,
        joinStr: `${numStr}${countStr}`
      }
    }
  }
  const match = fixedNum === 1 ? /^\d+(?:\.\d?)?/ : /^\d+(?:\.\d{0,2})?/
  const numberValue = number < 100000000 ? number / 10000 : number / 100000000

  return {
    numberValue: `${(numberValue).toString().match(match)}`,
    countStr,
    joinStr: `${(numberValue).toString().match(match)}${countStr}`
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
