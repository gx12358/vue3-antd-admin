import { app } from '@gx-config'
import { isObject, scrollTo } from '@gx-design-vue/pro-utils'

const { viewScrollRoot } = app.system

export function isLink(value: string): boolean {
  if (!value || typeof value !== 'string') return false

  const str = value.trim()

  // http(s) / protocol-relative
  if (/^(?:https?:)?\/\//.test(str)) return true

  // absolute / relative path
  if (
    str.startsWith('/')
    || str.startsWith('./')
    || str.startsWith('../')
  ) {
    return true
  }

  return false
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

export function numeral(value?: number) {
  return {
    format(fmt) {
      const num = Number(value)
      if (Number.isNaN(num)) return ''

      // 自动单位：1k、1.2m、3b ...
      if (fmt.includes('a')) {
        const abs = Math.abs(num)
        if (abs >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'b'
        if (abs >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'm'
        if (abs >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
      }

      // 判断是否需要千分位，例如格式里有 ','
      const needComma = fmt.includes(',')

      // 解析需要的小数位数：0.00 → 2 位
      const decimalMatch = fmt.match(/\.(0+)/)
      const decimals = decimalMatch ? decimalMatch[1].length : 0

      let str = num.toFixed(decimals)

      // 千分位处理
      if (needComma) {
        const parts = str.split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        str = parts.join('.')
      }

      return str
    }
  }
}

export function treeAntDataNode<T = any, D = AntDataNode>(
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
      children: item[children] && item[children].length > 0 ? treeAntDataNode(
        item[children],
        fieldNames
      ) : []
    }
  })
}

export function buildTreeMaps(tree: AntDataNode[]) {
  const descendantsMap = new Map<number, number[]>()

  function collect(node: AntDataNode): number[] {
    if (!node.children || node.children.length === 0) {
      descendantsMap.set(node.id!, [])
      return []
    }

    const all: number[] = []
    for (const child of node.children) {
      all.push(child.id!)
      all.push(...collect(child))
    }
    descendantsMap.set(node.id!, all)
    return all
  }

  tree.forEach(collect)
  return descendantsMap
}

export function cleanInvalidParents(
  dataKeys: Set<number>,
  tree: AntDataNode[],
  descendantsMap: Map<number, number[]>
) {
  function dfs(nodes: AntDataNode[]) {
    nodes.forEach((node) => {
      const children = descendantsMap.get(node.id!)!
      if (children.length === 0) return

      const allIn = children.every(k => dataKeys.has(k))
      if (!allIn) {
        dataKeys.delete(node.id!)
      }

      if (node.children) dfs(node.children)
    })
  }

  dfs(tree)
  return dataKeys
}

export function fillParentKeys(
  selectedKeys: Set<number>,
  tree: AntDataNode[],
  descendantsMap: Map<number, number[]>
) {
  function dfs(nodes: AntDataNode[]) {
    nodes.forEach((node) => {
      const children = descendantsMap.get(node.id!)!
      if (children.length === 0) return

      // 只要后代里有一个被选
      const hasAny = children.some(k => selectedKeys.has(k))
      if (hasAny) {
        selectedKeys.add(node.id!)
      }

      if (node.children) dfs(node.children)
    })
  }

  dfs(tree)
  return selectedKeys
}

export function antOptionsValue(data: any[], type: 'string' | 'number' = 'number') {
  return data.map((item) => {
    return {
      ...item,
      label: item.label || item.name,
      value: type === 'string' ? item.value.toString() : Number.isNaN(Number(item.value)) ? item.value : Number(item.value)
    }
  })
}
