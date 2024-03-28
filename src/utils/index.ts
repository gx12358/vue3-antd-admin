import PropTypes from 'ant-design-vue/es/_util/vue-types'

export { PropTypes }

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
 * @author gx12358 2539306317@qq.com
 * @description 父子关系的数组转换成树形结构数据
 * @param data
 * @returns {*}
 */
export function translateDataToTree(data) {
  const parent = data.filter(
    value => value.parentId === 'undefined' || value.parentId == null
  )
  const children = data.filter(
    value => value.parentId !== 'undefined' && value.parentId != null
  )
  const translator = (parent, children) => {
    parent.forEach((parent) => {
      children.forEach((current, index) => {
        if (current.parentId === parent.id) {
          const temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([ current ], temp)
          typeof parent.children !== 'undefined'
            ? parent.children.push(current)
            : (parent.children = [ current ])
        }
      })
    })
  }
  translator(parent, children)
  return parent
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 树形结构数据转换成父子关系的数组
 * @param data
 * @returns {[]}
 */
export function translateTreeToData(data) {
  const result: any[] = []
  data.forEach((item) => {
    const loop = (data) => {
      result.push({
        id: data.id,
        name: data.name,
        parentId: data.parentId
      })
      const child = data.children
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i])
        }
      }
    }
    loop(item)
  })
  return result
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 10位时间戳转换
 * @param time
 * @returns {string}
 */
export function tenBitTimestamp(time) {
  const date = new Date(time * 1000)
  const y = date.getFullYear()
  let m: any = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d: any = date.getDate()
  d = d < 10 ? '' + d : d
  let h: any = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute: any = date.getMinutes()
  let second: any = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second // 组合
}

/**
 * @author gx12358 2539306317@qq.com
 * @description 13位时间戳转换
 * @param time
 * @returns {string}
 */
export function thirteenBitTimestamp(time) {
  const date = new Date(time / 1)
  const y = date.getFullYear()
  let m: any = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d: any = date.getDate()
  d = d < 10 ? '' + d : d
  let h: any = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute: any = date.getMinutes()
  let second: any = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second // 组合
}
