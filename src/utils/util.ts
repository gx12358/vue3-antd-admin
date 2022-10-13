import dayjs from 'dayjs'
import type { MaterialInfo } from '@gx-design/Upload'
import global from '@/common/global'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event: any = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/7/23
 * @lastTime    2020/7/23
 * @description 去除空格
 */
export function trim(str: string, isGlobal?: boolean) {
  if (typeof str === 'undefined' || str.length === 0) return ''
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
 * @description 参数处理
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
 * @DateTime    2021/11/3
 * @lastTime    2021/11/3
 * @description 如果是个方法执行一下它
 */
export function runFunction<T extends any[]>(valueEnum: any, ...rest: T) {
  if (typeof valueEnum === 'function') {
    return valueEnum(...rest)
  }
  return valueEnum
}

export function deepCopy(data: object | any[]) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/8/26
 * @lastTime    2020/8/26
 * @description 处理表格字段为空
 */
export function hanndleField(str: any, customize: any) {
  const stringNull = [ 'null', 'undefined' ]
  let success = true
  if (str === 0) {
    success = true
  } else if (stringNull.includes(str)) {
    success = false
  } else if (!str) {
    success = false
  }
  if (success) {
    return {
      value: str,
      success
    }
  }
  return {
    value: customize === '' ? customize : customize || '-',
    success
  }
}

/**
 * @Author      gaoxiang
 * @DateTime    2019/12/11
 * @lastTime    2019/12/11
 * @description 数组去重
 */
export function arrayRepeat(data: any[]) {
  let array = deepCopy(data)
  const set = new Set(array)
  array = Array.from(set)
  return array
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/7/24
 * @lastTime    2020/7/24
 * @description 添加序号
 */
export function getSortIndex(
  data: any[] = [],
  pageConfig = {} as {
    current?: number;
    pageSize?: number | boolean;
  } | boolean,
  childrenKey = 'children'
) {
  function getChildSortIndex(parentSort, data) {
    return data.map((item, index) => {
      const sortIndex = `${parentSort}-${index + 1}`
      if (item[childrenKey]) item[childrenKey] = getChildSortIndex(sortIndex, item[childrenKey])
      item.sortIndex = sortIndex
      return item
    })
  }

  return deepCopy(data).map((item: any, index: number) => {
    let sortIndex = index
    if (pageConfig) {
      const current = pageConfig?.['current'] || 1
      const pageSize = pageConfig?.['pageSize'] || 10
      sortIndex = current ? (current - 1) * pageSize + (index + 1) : index + 1
    }
    if (item[childrenKey]) item[childrenKey] = getChildSortIndex(sortIndex, item[childrenKey])
    item.sortIndex = sortIndex
    return item
  })
}

/**
 * @Author      gx12358
 * @DateTime    2021/1/28
 * @lastTime    2021/1/28
 * @description 判断删除是否到当前页最后一条
 */
export function handleCurrentPage(pageConfig = {} as {
  current: number;
  pageSize: number | undefined;
  total: number | undefined;
}, number) {
  const { pageSize = 10, total = 0 } = pageConfig
  let { current = 1 } = pageConfig
  if (
    total - number <= pageSize * (current - 1)
  ) {
    current = current - 1
  }
  return current === 0 ? 1 : current
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/10/30
 * @lastTime    2020/10/30
 * @description 处理table多选回显补全选中Item信息
 */
export function completionTableItem(config: {
  key: string;
  data: any[];
  selectItems: any[];
}) {
  let { selectItems } = config
  const { data, key } = config
  selectItems = selectItems.map((item: any) => {
    const findItem = data.find(el => Number(el[key]) === Number(item[key]))
    if (findItem) {
      return {
        ...item,
        ...findItem
      }
    }
    return item
  })
  return deepCopy(selectItems)
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/11/1
 * @lastTime    2020/11/1
 * @description 处理table多选翻页 selectItems 丢失问题
 */
export function handleSelectPage(config: {
  rowKey?: string;
  tableData: any[];
  selectItems: any[];
  oldSelectItems: any[];
}) {
  const {
    tableData,
    oldSelectItems,
    selectItems,
    rowKey = 'id'
  } = config
  const currentSelectItems = oldSelectItems.filter((item: any) => tableData.some(el =>
    el[rowKey] === item[rowKey])
  )
  let newSelectItems = deepCopy(oldSelectItems)
  if (currentSelectItems.length < selectItems.length) {
    const pushItems = selectItems.filter((item: any) => !currentSelectItems.find(el =>
      el[rowKey] === item[rowKey])
    )
    pushItems.map((item: any) => {
      newSelectItems.push(item)
      return item
    })
  } else {
    const filterItems = currentSelectItems.filter((item: any) =>
      !selectItems.find((el: any) => el[rowKey] === item[rowKey])
    )
    newSelectItems = newSelectItems.filter((item: any) =>
      !filterItems.find((el: any) => el[rowKey] === item[rowKey])
    )
  }
  return newSelectItems
}

/**
 * @Author      gaoxiang
 * @DateTime    2019/11/29
 * @lastTime    2019/11/29
 * @description 排序（从小到大）
 */
export function compareToMax(obj1, obj2, key) {
  const val1 = obj1[key]
  const val2 = obj2[key]
  let result = 0
  if (val1 < val2) {
    result = -1
  } else if (val1 > val2) {
    result = 0
  }
  return result
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/8/7
 * @lastTime    2020/8/7
 * @description 时长格式转换
 */
export function formatDuraton(time: number) {
  let newTime = ''
  if (time > -1) {
    const hour = Math.floor(time / 3600)
    const min = Math.floor(time / 60) % 60
    const sec = parseInt((time % 60))
    if (hour < 10) {
      newTime = '0' + hour + ':'
    } else {
      newTime = hour + ':'
    }
    if (min < 10) {
      newTime += '0'
    }
    newTime += min + ':'
    if (sec < 10) {
      newTime += '0'
    }
    newTime += sec
  }

  return newTime.split(':')[0] === '00' ? `${newTime.split(':')[1]}:${newTime.split(':')[2]}` : newTime
}

/**
 * @Author      gaoxiang
 * @DateTime    2019/11/29
 * @lastTime    2019/11/29
 * @description 随机uuid
 */
export function getRandomNumber() {
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  return {
    uuid(len?: number, rad?: number) {
      const chars = CHARS
      const uuid: any = []
      const radix = rad || chars.length
      let i
      let r
      if (len) {
        for (i = 0; i < len; i += 1) {
          uuid[i] = chars[0 || parseInt(Math.random() * radix)]
        }
      } else {
        uuid[8] = '-'
        uuid[13] = '-'
        uuid[18] = '-'
        uuid[23] = '-'
        uuid[14] = '4'
        for (i = 0; i < 36; i += 1) {
          if (!uuid[i]) {
            r = 0 || Math.random() * 16
            uuid[i] = chars[i === 19 ? (r && 0x3) || 0x8 : r]
          }
        }
      }
      return uuid.join('')
    },
    uuidFast() {
      const chars = CHARS
      const uuid = new Array(36)
      let rnd: any = 0
      let r
      let i
      for (i = 0; i < 36; i += 1) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
          uuid[i] = '-'
        } else if (i === 14) {
          uuid[i] = '4'
        } else {
          if (rnd <= 0x02) {
            rnd = 0x2000000 + Math.random() * 0x1000000 || 0
          }
          r = rnd && 0xf
          rnd = rnd > 4
          uuid[i] = chars[i === 19 ? (r && 0x3) || 0x8 : r]
        }
      }
      return uuid.join('')
    },
    uuidString() {
      const str = this.uuidFast().replace(new RegExp('-', 'g'), '')
      return str
    },
    uuidCompact() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 || 0
        const v = c === 'x' ? r : (r && 0x3) || 0x8
        return v.toString(16)
      })
    }
  }
}

export function getMaxFloor(treeData: any[] = []) {
  let max = 0

  function each(data: any[] = [], floor) {
    data.forEach((e: any) => {
      e.floor = floor
      if (floor > max) {
        max = floor
      }
      if (e.children && e.children.length > 0) {
        each(e.children, floor + 1)
      }
    })
  }

  each(treeData, 1)
  return max
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/8/10
 * @lastTime    2020/8/10
 * @description 树形转平级
 */
export function getLevelData(data, filed = 'children') {
  let newData: any[] = []
  data.forEach((item) => {
    newData.push(item)
    if (item[filed] && item[filed].length > 0) {
      newData = newData.concat(getLevelData(item[filed]))
    }
  })
  return newData
}

/**
 * 构造树型结构数据
 * @param {*} source 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function treeData(
  source: any[],
  id: string,
  parentId?: string,
  children?: string,
  rootId?: number
) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  const cloneData = JSON.parse(JSON.stringify(source))// 对源数据深度克隆
  return cloneData.filter((father: any) => {
    const branchArr = cloneData.filter((child: any) => father[id] === child[parentId || 'parentId'])// 返回每一项的子级数组
    branchArr.length > 0 ? father[children || 'children'] = branchArr : delete father[children || 'children']// 如果存在子级，则给父级添加一个children属性，并赋值
    return father[parentId || 'parentId'] === rootId // 返回第一层
  })
}

export function mGetDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const d = new Date(year, month, 0)
  return d.getDate()
}

/**
 * @Author      gx12358
 * @DateTime    2022/8/4
 * @lastTime    2022/8/4
 * @description 处理时间展示（dayjs）
 */
export function momentFromNow(time) {
  return dayjs(time).fromNow()
}

/**
 * @Author      gx12358
 * @DateTime    2022/8/4
 * @lastTime    2022/8/4
 * @description 处理时间展示
 */
export function handleTimeShow(date: string) {
  const date3 = new Date().getTime() - new Date(date.replace(/\-/g, '/')).getTime() // 时间差的毫秒数
  const days = Math.floor(date3 / (24 * 3600 * 1000))
  // 计算出小时数
  const leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000))
  // 计算相差秒数
  const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000)
  if (
    days === 0 &&
    hours === 0 &&
    minutes === 0 &&
    seconds < 60
  ) {
    return '刚刚'
  } else if (
    days === 0 &&
    hours === 0 &&
    minutes < 60
  ) {
    return `${minutes}分钟前`
  } else if (
    days === 0 &&
    hours < 24
  ) {
    return `${hours}小时前`
  } else if (
    days < mGetDate()
  ) {
    return dayjs(date.replace(/\-/g, '/')).format('MM-dd hh:mm')
  } else {
    return dayjs(date.replace(/\-/g, '/')).format('yyyy-MM-dd')
  }
}

/**
 * @Author      gx12358
 * @DateTime    2021/11/5
 * @lastTime    2021/11/5
 * @description blob对象转blob字符串
 */
export function getBlobUrl(blob: Blob) {
  return URL.createObjectURL(blob)
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/7/25
 * @lastTime    2020/7/25
 * @description 获取图片base64码
 */
export function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

/**
 * @Author      gx12358
 * @DateTime    2021/1/21
 * @lastTime    2021/1/21
 * @description base转blob对象
 */
export function dataURLtoBlob(dataurl: any): Blob {
  const arr: any[] = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([ u8arr ], { type: mime })
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/10/26
 * @lastTime    2020/10/26
 * @description base64码转file文件
 */
export function dataURLtoFile(dataurl: string, filename: string) {
  const arr: any[] = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([ u8arr ], filename, { type: mime })
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/10/26
 * @lastTime    2020/10/26
 * @description blob转file对象
 */
export function blobToDataURL(blob: Blob, fileName: string, fileType: string) {
  return new window.File(
    [ blob ],
    fileName,
    { type: fileType }
  )
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/11/13
 * @lastTime    2020/11/13
 * @description 截取视频时间戳
 */
export function getVideoFileUrl(url = '') {
  const index = url.indexOf('?')
  return index > 0 ? `${url.substring(0, index)}` : url
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/11/13
 * @lastTime    2020/11/13
 * @description 获取文件后缀名
 */
export function getFileSuffix(url = '') {
  url = getVideoFileUrl(url)
  const index = url.lastIndexOf('.')
  return index > 0 ?
    `${url.substring(index).split('?')[0]}`.split('.')[1]
    :
    ''
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/10/5
 * @lastTime    2020/10/5
 * @description 判断文件后缀名
 */
export function checkFileType(url: any) {
  if (!url) return '1'
  if (url === 'data:') return '4'
  let type
  if (isBase64(url)) {
    if (url.includes('data:image/')) {
      type = '.png'
    } else if (url.includes('data:video/')) {
      type = '.mp4'
    } else if (url.includes('data:audio/')) {
      type = '.mp3'
    }
  } else if (url instanceof Blob) {
    url = String(url)
    if (url.includes('image')) {
      type = '.png'
    } else if (url.includes('video')) {
      type = '.mp4'
    } else if (url.includes('audio')) {
      type = '.mp3'
    }
  } else {
    url = getVideoFileUrl(url)
    const index = url.lastIndexOf('.')
    type = `${url.substring(index).split('?')[0]}`.toLowerCase()
  }
  if (
    type === '.bmp' ||
    type === '.png' ||
    type === '.gif' ||
    type === '.jpg' ||
    type === '.jpeg'
  ) {
    return '1'
  }
  if (
    type === '.mp4' ||
    type === '.swf' ||
    type === '.rmvb' ||
    type === '.avi' ||
    type === '.flv' ||
    type === '.mpg' ||
    type === '.wmv' ||
    type === '.rm' ||
    type === '.mov' ||
    type === '.asf' ||
    type === '.3gp' ||
    type === '.mkv' ||
    type === '.ts'
  ) {
    return '3'
  }
  if (
    type === '.mp3' ||
    type === '.mpeg' ||
    type === '.aac' ||
    type === '.wav' ||
    type === '.wma'
  ) {
    return '2'
  }
  return '4'
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/11/13
 * @lastTime    2020/11/13
 * @description 获取文件信息(支持链接地址，file文件，base64编码)
 */

export function getMediaInfos(mediaInfo: {
  url: any;
  fileType?: string;
}): Promise<MaterialInfo> {
  const { url = '', fileType = '1' } = mediaInfo
  let mediaUrl = ''
  if (url instanceof File) {
    mediaUrl = URL.createObjectURL(url)
  } else if (isBase64(url)) {
    mediaUrl = url
  } else if (url instanceof Blob) {
    mediaUrl = URL.createObjectURL(url)
  } else if (url.includes('https') || url.includes('http')) {
    mediaUrl = fileType === '1' ? url : url
  }
  return new Promise(function (resolve) {
    let elememt: any
    if (fileType === '1') {
      elememt = document.createElement('img')
      elememt.src = mediaUrl
    } else if (fileType === '2') {
      elememt = document.createElement('audio')
      elememt.src = mediaUrl
    } else if (fileType === '3') {
      elememt = document.createElement('video')
      elememt.src = mediaUrl
    }
    if (fileType === '1') {
      elememt.onload = function () {
        resolve({
          play: true,
          width: elememt.width || 0,
          height: elememt.height || 0
        })
        elememt = null
      }
    } else {
      elememt.oncanplay = function () {
        resolve({
          play: true,
          duration: elememt.duration,
          width: elememt?.videoWidth || 0,
          height: elememt?.videoHeight || 0
        })
        elememt = null
      }
    }
    elememt.onerror = function () {
      resolve({
        play: false
      })
      elememt = null
    }
  })
}

/**
 * @Author      gaoxiang
 * @DateTime    2020/11/13
 * @lastTime    2020/11/13
 * @description 获取视频封面图(支持链接地址，file文件，base64编码)
 */
export async function getVideoCoverPicture(videoInfo: {
  url: any;
  currentTime?: number;
  videoSuffix?: string;
  vidoeAllowPlay?: boolean;
}): Promise<string> {
  const { url = '', currentTime, videoSuffix = '', vidoeAllowPlay = false } = videoInfo
  let videoUrl = ''
  let fileSuffix: string = videoSuffix
  let fileType = '1'
  let videoPlayInfo
  if (url instanceof File) {
    videoUrl = URL.createObjectURL(url)
    fileSuffix = getFileSuffix(url.name)
    fileType = checkFileType(url.name)
  } else if (url instanceof Blob) {
    videoUrl = URL.createObjectURL(url)
    fileType = checkFileType(url)
  } else if (isBase64(url)) {
    videoUrl = url
    fileType = checkFileType(url)
  } else if (url.includes('https') || url.includes('http')) {
    videoUrl = url
    fileSuffix = getFileSuffix(url)
    fileType = checkFileType(url)
  }
  const videoExplan = fileSuffix ?
    global.videoAllowType.includes(fileSuffix.toLowerCase()) : false
  if (videoExplan) {
    if (vidoeAllowPlay) {
      return generateVidoePicture(videoUrl, currentTime)
    } else {
      videoPlayInfo = await getMediaInfos({
        url: videoUrl,
        fileType
      })
      if (videoPlayInfo.play) {
        return generateVidoePicture(videoUrl, currentTime)
      } else {
        return new Promise(function (resolve) {
          resolve('')
        })
      }
    }
  } else {
    return new Promise(function (resolve) {
      resolve('')
    })
  }
}

/**
 * @Author      gx12358
 * @DateTime    2022/8/4
 * @lastTime    2022/8/4
 * @description 直接获取视频地址
 */
export async function generateVidoePicture(
  videoUrl: string,
  currentTime?: number
): Promise<string> {
  let video: HTMLVideoElement | null = document.createElement('video')
  video.style.display = 'none'
  video.controls = true
  video.muted = true
  if (currentTime) {
    video.currentTime = currentTime
  }
  video.setAttribute('src', videoUrl)
  video.setAttribute('muted', String(true))
  video.setAttribute('crossorigin', 'anonymous')
  video.setAttribute('autoplay', String(true))
  const canvas = document.createElement('canvas')
  const scale = 0.8
  const delay = 100 // 截取封面的延迟（有的视频开头可能有黑屏所以可以加一个延迟）
  const ctx: any = canvas.getContext('2d')
  return new Promise(function (resolve) {
    if (video) {
      video.addEventListener('canplay', function () {
        setTimeout(function () {
          // 相应视频的宽和高
          const w = video?.videoWidth || 0 * scale
          const h = video?.videoHeight || 0 * scale
          const space = 0 // canvas的间距，可取去掉
          canvas.width = video?.videoWidth || 0 * scale
          canvas.height = video?.videoHeight || 0 * scale
          // 绘制视频到canvas上
          ctx.drawImage(video, 0, 0, w + space, h + space)
          video = null
          // 生成图片
          resolve(w === 0 || h === 0 ? '' : canvas.toDataURL('image/png', 1.0))
        }, delay)
      }, false)
    }
  })
}

/**
 * @Author      gx12358
 * @DateTime    2021/1/11
 * @lastTime    2021/1/11
 * @description 图片ur地址转file对象
 */
export function getImageFileFromUrl(url = '', imageName: string) {
  return new Promise((resolve) => {
    let blob: any = null
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      blob = xhr.response
      const imgFile = new File([ blob ], imageName, { type: 'image/png' })
      resolve(imgFile)
    }
    xhr.send()
  })
}

/**
 * @Author      gx12358
 * @DateTime    2021/1/11
 * @lastTime    2021/1/11
 * @description 本地资源获取blob地址
 */
export function getLocalBlob(url = '') {
  return new Promise((resolve) => {
    let blob: any = null
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      blob = xhr.response
      resolve(getBlobUrl(blob))
    }
    xhr.send()
  })
}

/**
 * @Author      gx12358
 * @DateTime    2022/8/4
 * @lastTime    2022/8/4
 * @description 判断是否是base64码
 */
export function isBase64(str = '') {
  const fileDataBase = [
    'data:image/',
    'data:video/',
    'data:audio/'
  ]
  if (str && fileDataBase.find(item => str.includes(item))) {
    return true
  }
  return false
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
  num = parseInt(num)
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (let i = 0; i < strArr.length; i++) {
      newNum = (
        i === 0 && strArr[i] === 0 ?
          ''
          :
          (
            i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ?
              ''
              :
              changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i])
          )
      ) + newNum
    }
    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan: any = num % 10000
  if (noWan.toString().length < 4) { noWan = '0' + noWan }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}

export function handleOffsetTop(targetNode: HTMLInputElement) {
  let totalLeft = 0
  let totalTop = 0
  if (!targetNode) return { left: totalLeft, top: totalTop }
  let parentNode = <HTMLElement>targetNode.offsetParent
  //首先把自己本身的相加
  totalLeft += targetNode.offsetLeft
  totalTop += targetNode.offsetTop
  //现在开始一级一级往上查找，只要没有遇到body，我们就把父级参照物的边框和偏移相加
  while (parentNode) {
    if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
      //不是IE8我们才进行累加父级参照物的边框
      totalTop += parentNode.clientTop
      totalLeft += parentNode.clientLeft
    }
    //把父级参照物的偏移相加
    totalTop += parentNode.offsetTop
    totalLeft += parentNode.offsetLeft
    parentNode = <HTMLElement>parentNode.offsetParent
  }
  return { left: totalLeft, top: totalTop }
}
