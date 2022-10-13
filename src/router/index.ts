import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import config from '/config/config'
import BasicLayout from '@/layout/BasicLayout.vue'
import BlankLayout from '@/layout/BlankLayout.vue'
import PageView from '@/layout/PageView.vue'
import UserLayout from '@/layout/UserLayout.vue'

const { routerMode } = config.defaultSettings

function handleRouterMode() {
  switch (routerMode) {
    case 'hash':
      return createWebHashHistory()
      break
    case 'browser':
      return createWebHistory()
      break
    default:
      return createWebHashHistory()
      break
  }
}

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
export const basicRoutes: AppRouteModule[] = [
  {
    path: '/workplace',
    name: 'Workplace',
    component: () => import('@/views/dashboard/workplace/index.vue'),
    meta: {
      tagHidden: true,
      hideInMenu: true,
      homePage: 1,
      title: '工作台'
    }
  }
]
export const asyncRoutes: AppRouteModule[] = [
  {
    path: '/',
    name: '首页',
    component: BasicLayout,
    redirect: '/index/workplace',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: PageView,
        redirect: '/index/workplace',
        meta: {
          title: '首页',
          tagFixed: true
        },
        children: [
          {
            path: '/index/workplace',
            component: () => import('@/views/dashboard/workplace/index.vue'),
            meta: {
              title: '工作台',
              tagFixed: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/:path(.*)*',
    redirect: '/exception/404'
  }
]

const router = createRouter({
  history: handleRouterMode(),
  routes: constantRoutes as unknown as RouteRecordRaw[]
})

export default router
