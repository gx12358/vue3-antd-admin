import type { AppRouteModule, MenuDataItem } from '@gx-design-vue/pro-layout'
import { warning } from '@gx-design/utils'
import { getMaxFloor } from '@gx-design-vue/pro-utils'
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

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 根路由
 */
const rootRouter: MenuDataItem[] = buildMenu([
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
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
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
export function getRootMenu(rows: MenuDataItem[]): MenuDataItem[] {
  let menus: MenuDataItem[] = []
  if (getMaxFloor(cloneDeep(rows)) > 1) {
    menus = buildMenu(rows)
  } else {
    buildtree(rows, menus, 0)
  }
  rootRouter[0].children = menus
  rootRouter[0].children.push({
    key: 'externalLink',
    path: '/externalLink',
    meta: {
      title: '外链地址'
    },
    hidden: true
  } as MenuDataItem)
  return cloneDeep(rootRouter)
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 格式化 后端 结构信息并递归生成层级路由表
 */
export const generator = (routerMap: MenuDataItem[], parent?: AppRouteModule) => {
  return routerMap.map((item: MenuDataItem) => {
    const parentPath = parent?.path || ''
    const currentRouter: AppRouteModule = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: parentPath
        ? `${parent.path === '/' ? '' : parentPath}/${item.path}`
        : `/${item.path}`,
      // 路由名称，建议唯一
      name: item.name || '',
      // 该路由对应页面的 组件 优先根据组件名或者key从constantRouterComponents获取，没有则通过组件名地址查询
      component: item.component
        ? (LayoutMap.get(item.component || item.key) || asyncImportRoute(item.component))
        : undefined,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      redirect: item.redirect,
      meta: {
        title: item.title || '',
        tagFixed: item.tagFixed as boolean,
        tagHidden: item.tagHidden as boolean,
        icon: item.icon || undefined,
        homePage: item.homePage || 0,
        iconType: item.iconType || undefined,
        hideInMenu: item.hideInMenu || false,
        hideChildrenInMenu: item.hideChildrenInMenu || false,
        target: item.target,
        keepAlive: item.keepAlive,
        targetStatus: item.targetStatus,
        animateDisabled: item.animateDisabled,
        currenFulltPath: item.currenFulltPath
      }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

function handleMenuParams(menuItem: MenuDataItem): MenuDataItem {
  const {
    title = '',
    menuType,
    icon = '',
    iconType = 1, // 菜单图标类型 0:本地 1:自定义 2:图片
    tagFixed = '1', // 标签栏固定状态（标签栏路由地址是否固定（只有标签栏为显示转态才生效））0:是 1:否
    tagHidden = '0', // 标签栏显示状态（隐藏的路由是否显示在标签栏中（只有标签栏为显示转态才生效））0:显示 1:隐藏
    homePageFlag = 0, // 是否为主页（选择后为登录后跳转改地址，不选择默认跳转 /）0:否 1:是
    isFrame = '1', // 是否外链 0:是 1:否
    keepAlive = false,
    animateDisabled = false,
    redirect,
    currenFulltPath,
    outLinkType = 0 // 外链类型（选择是系统内则以iframe形式在系统内部展示，否则跳转新页面打开） 0:系统内 1:系统外
  } = menuItem.meta ?? menuItem
  return {
    title,
    name: menuItem.name || title,
    key: menuItem.name || title,
    icon,
    keepAlive,
    menuType,
    iconType: iconType || 1,
    hideInMenu: !!menuItem.hidden,
    hideChildrenInMenu: !!menuItem.hideChildrenInMenu,
    homePage: homePageFlag,
    path: menuItem.path && menuItem.path.length > 0
      ? menuItem.path
      : undefined,
    component: menuItem.component,
    redirect: redirect === 'noRedirect'
      ? ''
      : redirect,
    animateDisabled,
    currenFulltPath,
    tagFixed: tagFixed === '0',
    tagHidden: tagHidden === '1',
    target: isFrame === '0' ? menuItem.target : '',
    targetStatus: outLinkType || 0
  }
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 将后台树形结构菜单数据添加后修改属性（具体修改看后台返回值）
 */
export function buildMenu(list: MenuDataItem[]) {
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
export function buildtree(
  rootMenu: MenuDataItem[],
  menuList: MenuDataItem[],
  parentId: string | number
) {
  rootMenu.forEach((muenuItem) => {
    if (muenuItem.parentId === parentId) {
      const child: MenuDataItem = { ...handleMenuParams(muenuItem), children: [] }
      buildtree(rootMenu, child.children, muenuItem.menuId)
      if (child.children.length === 0) {
        delete child.children
      }
      menuList.push(child)
    }
  })
}
