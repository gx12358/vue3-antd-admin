import { cloneDeep } from 'lodash-es'
import { getMaxFloor } from '@/utils/util'

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: () => import('@/layout/BasicLayout.vue'), // 基础页面布局，包含了头部导航，侧边栏和通知栏
  PageView: () => import('@/layout/PageView.vue'),
  IframeView: () => import('@/layout/IframeView.vue')
  // 你需要动态引入的页面组件
}
/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 本地菜单路由
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
 * @description 获取当前path的component
 */
export const loadView = (view: string) => {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../views/**/*.{vue,tsx}')
  // 路由懒加载
  return dynamicImport(dynamicViewsModules, view)
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) {
  const keys = Object.keys(dynamicViewsModules)
  const matchKeys = keys.filter((key: string) => {
    let k = key.replace('../views', '')
    const lastIndex = k.lastIndexOf('.')
    k = k.substring(0, lastIndex)
    return k === `/${component}`
  })
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return dynamicViewsModules[matchKey]
  }
  if (matchKeys?.length > 1) {
    return
  }
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 格式化 后端 结构信息并递归生成层级路由表
 */
export const generator = (routerMap: MenuDataItem[], parent?) => {
  return routerMap.map((item: any) => {
    const currentRouter: AppRouteModule = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: parent && parent.path
        ? `${parent.path === '/'
          ? ''
          : (parent.path || '')}/${item.path}`
        : `/${item.path}`,
      // 路由名称，建议唯一
      name: item.name || '',
      // 该路由对应页面的 组件 优先根据组件名或者key从constantRouterComponents获取，没有则通过组件名地址查询
      component:
        constantRouterComponents[item.component || item.key] ||
        loadView(item.component),
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: item.title || '',
        tagFixed: item.tagFixed,
        tagHidden: item.tagHidden,
        icon: item.icon || undefined,
        homePage: item.homePage || 0,
        iconType: item.iconType || undefined,
        hideInMenu: item.hidden || false,
        target: item.target,
        targetStatus: item.targetStatus
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

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 将后台树形结构菜单数据添加后修改属性（具体修改看后台返回值）
 */
export function buildMenu(list: MenuDataItem[]) {
  return list.map((item: MenuDataItem) => {
    const {
      title = '',
      icon = '',
      iconType = 1, //菜单图标类型 0:本地 1:自定义 2:图片
      tagFixed = '1', //标签栏固定状态（标签栏路由地址是否固定（只有标签栏为显示转态才生效））0:是 1:否
      tagHidden = '0', //标签栏显示状态（隐藏的路由是否显示在标签栏中（只有标签栏为显示转态才生效））0:显示 1:隐藏
      homePageFlag = 0, //是否为主页（选择后为登录后跳转改地址，不选择默认跳转 /）0:否 1:是
      isFrame = '1', //是否外链 0:是 1:否
      outLinkType = 0 //外链类型（选择是系统内则以iframe形式在系统内部展示，否则跳转新页面打开） 0:系统内 1:系统外
    } = item.meta ?? item
    const child = {
      title,
      level: 'tree',
      name: item.name || title,
      key: item.name || title,
      icon,
      iconType: iconType || 1,
      hidden: item.hidden,
      homePage: homePageFlag,
      path: item.path && item.path.length > 0
        ? item.path
        : undefined,
      component: item.component,
      redirect: item.redirect === 'noRedirect'
        ? ''
        : item.redirect,
      tagFixed: tagFixed === '0',
      tagHidden: tagHidden === '1',
      target: isFrame === '0' ? item.target : '',
      targetStatus: outLinkType || 0,
      children: item.children && item.children.length > 0
        ? buildMenu(item.children)
        : []
    }
    return child
  })
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 将后台菜单数据变成树形结构（具体修改看后台返回值）
 */
export function buildtree(list: MenuDataItem[], arr: MenuDataItem[], parentId: string | number) {
  list.forEach((item: MenuDataItem) => {
    const {
      title = '',
      icon = '',
      iconType = 1, //菜单图标类型 0:本地 1:自定义 2:图片
      tagFixed = '1', //标签栏固定状态（标签栏路由地址是否固定（只有标签栏为显示转态才生效））0:是 1:否
      tagHidden = '0', //标签栏显示状态（隐藏的路由是否显示在标签栏中（只有标签栏为显示转态才生效））0:显示 1:隐藏
      homePageFlag = 0, //是否为主页（选择后为登录后跳转改地址，不选择默认跳转 /）0:否 1:是
      isFrame = '1', //是否外链 0:是 1:否
      outLinkType = 0 //外链类型（选择是系统内则以iframe形式在系统内部展示，否则跳转新页面打开） 0:系统内 1:系统外
    } = item.meta ?? item
    if (item.parentId === parentId) {
      const child: any = {
        level: 'flat',
        title,
        name: item.name || title,
        key: item.name || title,
        icon,
        iconType,
        hidden: item.hidden,
        homePage: homePageFlag,
        path: item.path && item.path.length > 0
          ? item.path
          : undefined,
        component: item.component,
        redirect: item.redirect === 'noRedirect'
          ? ''
          : item.redirect,
        tagFixed: tagFixed === '0',
        tagHidden: tagHidden === '1',
        target: isFrame === '0' ? item.target : '',
        targetStatus: outLinkType || 0,
        children: []
      }
      buildtree(list, child.children, item.menuId)
      if (child.children.length === 0) {
        delete child.children
      }
      arr.push(child)
    }
  })
}
