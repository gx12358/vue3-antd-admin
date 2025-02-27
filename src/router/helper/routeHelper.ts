import { getMaxFloor } from '@gx-design-vue/pro-utils'
import { warning } from '@gx-design/utils'
import { cloneDeep } from 'lodash-es'

/**
 * @description: default layout
 */
export const BasicLayout = () => import('@/layout/BasicLayout.vue')
export const IframeView = () => import('@/layout/IframeView.vue')
export const EXCEPTION_COMPONENT = () => import('@/views/exception/404/index.vue')

const LayoutMap = new Map<string, any>()

LayoutMap.set('BasicLayout', BasicLayout)
LayoutMap.set('IframeView', IframeView)

let dynamicViewsModules: Record<string, () => Promise<Record<string, any>>>

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 根路由
 */
const rootRouter: SystemMenuItem[] = buildMenu([
  {
    path: '/',
    name: 'index',
    meta: { title: '首页' },
    component: 'BasicLayout',
    redirect: '',
    children: []
  }
])

// Dynamic introduction
function asyncImportRoute(component: string) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}')
  return dynamicImport(dynamicViewsModules, component)
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Record<string, any>>>,
  component: string
) {
  const keys = Object.keys(dynamicViewsModules)
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../../views', '')
    if (!component)
      return false
    const startFlag = component.startsWith('/')
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx')
    const startIndex = startFlag ? 0 : 1
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.')
    return k.substring(startIndex, lastIndex) === component
  })
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return dynamicViewsModules[matchKey]
  } else if (matchKeys?.length > 1) {
    warning(
      true,
      '请不要在views文件夹下的同一层次目录中创建具有相同文件名的“.vue”和“.TSX”文件。这将导致动态导入失败'
    )
  } else {
    warning(
      true,
      '在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!'
    )
    return EXCEPTION_COMPONENT
  }

  return false
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 将后台树形数据菜单和本地菜单结合
 */
export function getRootMenu(rows: SystemMenuItem[]): SystemMenuItem[] {
  let menus: SystemMenuItem[] = []
  if (getMaxFloor(rows) > 1) {
    menus = buildMenu(rows)
  } else {
    buildTreeMenu(rows, menus, 0)
  }
  rootRouter[0].children = menus
  rootRouter[0].children.push({
    key: 'externalLink',
    path: '/externalLink',
    name: 'ExternalLink',
    hidden: true,
    meta: {
      title: '外链地址'
    }
  })
  return cloneDeep(rootRouter)
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 格式化 后端 结构信息并递归生成层级路由表
 */
export const generator = (routerMap: SystemMenuItem[], parent?: AppRouteModule) => {
  return routerMap.map((item: SystemMenuItem) => {
    const parentPath = parent?.path || ''
    const currentRouter: AppRouteModule = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: parentPath
        ? `${parent?.path === '/' ? '' : parentPath}/${item.path}`
        : `/${item.path}`,
      // 路由名称，建议唯一
      name: item.name || '',
      // 该路由对应页面的 组件 优先根据组件名或者key从constantRouterComponents获取，没有则通过组件名地址查询
      component: item.component
        ? (LayoutMap.get(item.component || item.key as string) || asyncImportRoute(item.component))
        : undefined,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      redirect: item.redirect,
      meta: {
        order: item.order,
        title: item.title || '',
        menuType: item.menuType,
        tabState: item.tabState,
        icon: item.icon || '',
        isHome: item.isHome || 0,
        iconFont: item.iconFont || '',
        hidden: item.hidden,
        hideChildren: item.hidden,
        hideInMenu: item.hideInMenu || false,
        hideChildrenInMenu: item.hideChildrenInMenu || false,
        link: item.link,
        keepAlive: item.keepAlive,
        linkStatus: item.linkStatus,
        menuSelectKey: item.menuSelectKey,
        animateDisabled: item.animateDisabled
      }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

function handleMenuParams(menuItem: SystemMenuItem): SystemMenuItem {
  const meta: SystemMenuItem = menuItem.meta as SystemMenuItem ?? menuItem
  const {
    link,
    linkStatus,
    title = '',
    menuType,
    icon = '',
    menuSelectKey,
    order,
    iconFont = 'iconfont',
    tabState, // 标签栏固定状态（标签栏路由地址是否固定（只有标签栏为显示转态才生效））0:是 1:否
    isHome = 0, // 是否为主页（选择后为登录后跳转改地址，不选择默认跳转 /）0:否 1:是
    keepAlive = false,
    hidden = false,
    hideChildren = false,
    hideInMenu = false,
    hideChildrenInMenu = false,
    animateDisabled = false
  } = meta
  return {
    key: menuItem.name,
    name: menuItem.name,
    path: menuItem.path,
    disabled: menuItem.disabled || false,
    redirect: menuItem.redirect,
    component: menuItem.component,

    icon,
    title,
    order,
    keepAlive,
    menuType,
    iconFont,
    hidden,
    hideInMenu,
    hideChildren,
    menuSelectKey,
    hideChildrenInMenu,
    isHome,
    animateDisabled,
    tabState,
    link,
    linkStatus
  }
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 将后台树形结构菜单数据添加后修改属性（具体修改看后台返回值）
 */
export function buildMenu(list: SystemMenuItem[]): SystemMenuItem[] {
  return list.map((muenuItem) => {
    return { ...handleMenuParams(muenuItem), children: buildMenu(muenuItem.children || []) }
  })
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 将后台菜单数据变成树形结构（具体修改看后台返回值）
 */
export function buildTreeMenu(
  rootMenu: SystemMenuItem[],
  menuList: SystemMenuItem[],
  parentId?: string | number
) {
  rootMenu.forEach((menuItem) => {
    if (menuItem.parentId === parentId) {
      const child: SystemMenuItem = { ...handleMenuParams(menuItem), children: [] }
      buildTreeMenu(rootMenu, child.children as SystemMenuItem[], menuItem.menuId)
      if (child?.children?.length === 0) {
        delete child.children
      }
      menuList.push(child)
    }
  })
}
