import type { AppRouteModule } from '@gx-design-vue/pro-layout'
import BasicLayout from '@/layout/BasicLayout.vue'
import BlankLayout from '@/layout/BlankLayout.vue'
import UserLayout from '@/layout/UserLayout.vue'

// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const routeModuleList: AppRouteModule[] = []

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules[key] as any).default || {}
  const modList = Array.isArray(mod) ? [ ...mod ] : [ mod ]
  routeModuleList.push(...modList)
})

// 基本路由
export const constantRoutes: AppRouteModule[] = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    children: [
      {
        path: '/user/login',
        name: 'Login',
        meta: {
          hideInMenu: true,
          title: '登录'
        },
        component: () => import('@/views/user/login/index.vue')
      }
    ]
  },
  {
    path: '/exception',
    name: 'Exception',
    component: BlankLayout,
    redirect: '/exception/403',
    meta: {
      hideInMenu: true,
      title: '错误页',
      icon: 'error-warning-line'
    },
    children: [
      {
        path: '/exception/403',
        name: 'Error403',
        component: () => import('@/views/exception/403/index.vue'),
        meta: {
          hideInMenu: true,
          title: '403',
          icon: 'error-warning-line'
        }
      },
      {
        path: '/exception/404',
        name: 'Error404',
        component: () => import('@/views/exception/404/index.vue'),
        meta: {
          hideInMenu: true,
          title: '404',
          icon: 'error-warning-line'
        }
      }
    ]
  }
]

// authentication为all（后端生成的路由）本地路由
export const asyncRoutes: AppRouteModule[] = routeModuleList

// 自定义路由
export const localRoutes: AppRouteModule[] = [
  {
    path: '/',
    name: '首页',
    component: BasicLayout,
    redirect: '/workplace',
    children: routeModuleList
  },
  {
    path: '/:path(.*)*',
    redirect: '/exception/404'
  }
]
