export { default as isUrl } from './isUrl'
export { default as isImg } from './isImg'

export function clearMenuItem(menusData: AppRouteModule[]): AppRouteModule[] {
  return menusData
    .map((item: AppRouteModule) => {
      const finalItem = { ...item }
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null
      }

      if (finalItem && finalItem?.children) {
        if (
          finalItem.children.some(
            (child: AppRouteModule) => child && child.name && !child.meta?.hideInMenu
          )
        ) {
          return {
            ...item,
            children: clearMenuItem(finalItem.children)
          }
        }
        delete finalItem.children
      }
      return finalItem
    })
    .filter(item => item) as AppRouteModule[]
}

export function flatMap(menusData: AppRouteModule[]): AppRouteModule[] {
  return menusData
    .map(item => {
      const finalItem = { ...item } as AppRouteModule
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null
      }
      finalItem.linkPath = getMenuFirstLastChildPath(finalItem.children || [])

      if (finalItem.children) {
        delete finalItem.children
      }
      return finalItem
    })
    .filter(item => item) as any[]
}

export function getMenuFirstChildren(menus: AppRouteModule[], key?: string) {
  const menuKey = (key || '').split('/').length === 2
    ? (key || '')
    : `/${(key || '').split('/')[1]}`
  return key === undefined
    ? []
    : (menus[menus.findIndex(menu => menu.path === menuKey)] || {}).children || []
}

export function getMenuFirstLastChildPath(data: AppRouteModule[]): string {
  let newPath = ''
  const getRoutePath = function (newdata) {
    let firstPath = ''
    if (newdata.children && newdata.children.length > 0) {
      firstPath = getRoutePath(newdata.children[0])
    } else {
      firstPath = `${newdata.path}`
    }
    return firstPath
  }
  if (data.length > 0 && data[0].children && data[0].children.length > 0) {
    newPath = getRoutePath(data[0].children[0])
  } else {
    newPath = data.length > 0 ? data[0].path : ''
  }
  return newPath
}

export interface Attrs {
  [key: string]: string;
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export type EventHandlers<E> = {
  [K in StringKeyOf<E>]?: E[K] extends Function ? E[K] : (payload: E[K]) => void;
};

/**
 * Creates an object composed of the picked object properties.
 * @param obj The source object
 * @param paths The property paths to pick
 */
export function pick<T, K extends keyof T>(obj: T, paths: K[]): Pick<T, K> {
  return {
    ...paths.reduce((mem, key) => ({ ...mem, [key]: obj[key] }), {}),
  } as Pick<T, K>
}
