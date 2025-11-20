import { app } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { defineStore } from 'pinia'
import { getAuthPermissionInfoApi, loginApi, logoutApi } from '@/services/user'
import { accessToken } from '@/utils/accessToken'
import { useStoreDict } from './dict'
import { useStorePermission } from './permission'
import { useStoreRoutes } from './routes'

const { loginInterception, router } = app.system

export interface UserState {
  token: string;
  refreshToken: string;
  userInfo: UserInfo;
}

// 0 返回登录页 1 成功 2 返回注册页
export type CheckUserStatus = 0 | 1 | 2

export const useStoreUser = defineStore('user', () => {
  const storeDict = useStoreDict()
  const storeRoutes = useStoreRoutes()
  const storePermission = useStorePermission()

  const { token, refreshToken } = accessToken.getAccessToken()

  const [ state, setValue ] = useReactiveState<UserState>({
    token,
    refreshToken,
    userInfo: {} as UserInfo
  }, { omitNil: false, omitEmpty: false })

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 登录拦截放行时，设置虚拟角色
   */
  const setVirtualUserInfo = (): CheckUserStatus => {
    return 1
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 登录
   */
  const userLogin = async (params: any): Promise<boolean> => {
    try {
      const { accessToken: token, refreshToken } = await loginApi(params)
      setValue({ token, refreshToken })
      accessToken.setAccessToken({ token, refreshToken })
      return true
    } catch {}
    return false
  }

  const checkUserPermission = async (): Promise<{ status: CheckUserStatus; routes: AppRouteModule[] }> => {
    let status: CheckUserStatus = 0
    let routes: AppRouteModule[] = []
    if (loginInterception) {
      try {
        const { user, roles, permissions, menus } = await getAuthPermissionInfoApi()
        status = 1
        storePermission.setValue({ role: roles, auths: permissions })
        setValue({ userInfo: { ...user } })
        if (router.auth === 'all') {
          routes = await storeRoutes.setAllRoutes(menus)
        }
        return { status, routes }
      } catch {}
    } else {
      status = setVirtualUserInfo()
    }

    return { status, routes }
  }

  const resetPermissions = () => {
    accessToken.removeAccessToken()
    setValue({ token: '', refreshToken: '', userInfo: {} })
    storeDict.clear()
    storePermission.clear()
    storeRoutes.clear()
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/5/15
   * @lastTime    2022/5/15
   * @description 用户退出登录
   */
  const userLogout = async () => {
    try {
      await logoutApi()
    } catch {}
    resetPermissions()
  }

  return {
    ...toRefs(state),
    userLogin,
    userLogout,
    setValue,
    resetPermissions,
    checkUserPermission
  }
})
