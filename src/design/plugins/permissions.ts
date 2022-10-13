/**
 * @author gx12358 2539306317@qq.com
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import { message } from 'ant-design-vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import config from '/config/config'
import router from '@/router'
import { useStoreUser, useStoreRoutes, useStoreSettings, useStorePermission } from '@gx-vuex'
import { scrollTo } from '@gx-design/utils'
import getPageTitle from '@/utils/pageTitle'

const {
  viewScrollRoot,
  authentication,
  loginInterception,
  recordRoute,
  routerLoadTime,
  routesWhiteList
} = config.defaultSettings

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _, next) => {
  const user = useStoreUser()
  const routes = useStoreRoutes()
  const settings = useStoreSettings()
  const permission = useStorePermission()
  message.destroy()
  if (settings.showProgressBar) NProgress.start()
  if (
    settings.layout !== 'wide' &&
    routes.routerLoadList.every(item => item !== to.path) &&
    routesWhiteList.indexOf(to.path) === -1
  ) {
    routes.addRouterLoadList(to.path)
    routes.changeValue('routerLoading', true)
  }
  let hasToken = !!user.accessToken
  let hasUserInfo = true
  let accessRoutes: AppRouteModule[] = []
  if (!loginInterception) hasToken = true
  if (hasToken) {
    if (to.path === '/user/login') {
      next({ path: '/', replace: true })
      NProgress.done()
    } else {
      const hasRoles = permission.role.length > 0
      if (hasRoles) {
        next()
        NProgress.done()
      } else {
        try {
          if (loginInterception) {
            hasUserInfo = await user.queryUserInfo()
          } else {
            //loginInterception为false（关闭登录拦截时）时，创建虚拟角色
            hasUserInfo = await user.setVirtualRoles()
          }
          if (hasUserInfo) {
            if (authentication === 'intelligence') {
              accessRoutes = await routes.setRoutes()
            } else if (authentication === 'all') {
              accessRoutes = await routes.setAllRoutes()
            }
          }
          if (hasUserInfo) {
            if (accessRoutes.length) {
              accessRoutes.forEach((item: any) => {
                router.addRoute(item)
              })
              next({ ...to, replace: true })
            } else {
              next({ path: '/exception/403' })
            }
            routes.changeValue('meunLoading', false)
          } else {
            user.resetPermissions()
            if (recordRoute)
              next({
                path: '/user/login',
                query: { redirect: to.path },
                replace: true
              })
            else next({ path: '/user/login', replace: true })
          }
          NProgress.done()
        } catch (e) {
          user.resetPermissions()
          if (recordRoute)
            next({
              path: '/user/login',
              query: { redirect: to.path },
              replace: true
            })
          else next({ path: '/user/login', replace: true })
          NProgress.done()
        }
      }
    }
  } else {
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      user.resetPermissions()
      if (recordRoute) {
        next({ path: '/user/login', query: { redirect: to.path }, replace: true })
      } else next({ path: '/user/login', replace: true })
    }
    NProgress.done()
  }
})


router.afterEach((to) => {
  const routes = useStoreRoutes()
  const settings = useStoreSettings()
  const { meta }: any = to
  document.title = getPageTitle(meta.title || '')
  NProgress.done()
  if (settings.layout === 'wide') {
    routes.changeValue('routerLoading', false)
    scrollTo(0, {
      getContainer: () => document.querySelector(viewScrollRoot) as HTMLInputElement,
      duration: 200
    })
  } else {
    setTimeout(() => {
      routes.changeValue('routerLoading', false)
    }, routerLoadTime || 200)
  }
})
