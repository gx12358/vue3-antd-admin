import { app } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { isArray, isNumber, isObject } from '@gx-design-vue/pro-utils'
import my from '@images/public/my.png'
import { defineStore } from 'pinia'
import { getUserInfo, login, logout } from '@/services/user-center'
import { accessToken } from '@/utils/accessToken'
import { useStoreDict } from './dict'
import { useStorePermission } from './permission'
import { useStoreRoutes } from './routes'

const { loginInterception } = app.system

export interface UserState {
  token: string;
  refreshToken: string;
  userInfo: UserDetails;
}

// 0 返回登录页 1 成功 2 返回注册页
export type CheckUserStatus = 0 | 1 | 2

export const useStoreUser = defineStore('user', () => {
  const dict = useStoreDict()
  const routes = useStoreRoutes()
  const permission = useStorePermission()

  const { token, refreshToken } = accessToken.getAccessToken()

  const [ state, setValue ] = useReactiveState<UserState>({
    token,
    refreshToken,
    userInfo: {} as UserDetails
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
      const response: ResponseResult<{ token: string; expiresIn: number; refreshToken?: string; }> = await login(params)
      if (response) {
        const token = response.data?.token
        const refreshToken = response.data?.refreshToken
        if (token) {
          setValue({ token, refreshToken })
          accessToken.setAccessToken({ token, refreshToken })
          return true
        }
      }

      return false
    } catch {
      return false
    }
  }

  const updateUserInfo = async (): Promise<CheckUserStatus> => {
    let status: CheckUserStatus = 0
    try {
      const response: ResponseResult<null, UserInfo> = await getUserInfo()
      const { user, roles, permissions } = response || {} as UserInfo
      if (response && user && isObject(user)) {
        if (isNumber(user.userId) && roles && isArray(roles)) {
          status = 1
          permission.setValue({ admin: user.admin, role: roles, ability: permissions })
          setValue({ userInfo: { ...user, avatar: my } })
        }
      }
    } catch {}
    return status
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 获取用户信息
   */
  const checkUserPermission = async (): Promise<CheckUserStatus> => {
    let status: CheckUserStatus = 0
    if (loginInterception) {
      status = await updateUserInfo()
    } else {
      status = setVirtualUserInfo()
    }
    return status
  }

  const resetPermissions = () => {
    accessToken.removeAccessToken()
    setValue({ token: '', refreshToken: '', userInfo: {} })
    dict.clear()
    permission.setValue({ admin: false, role: undefined, ability: [] })
    routes.setValue({ routes: [] })
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/5/15
   * @lastTime    2022/5/15
   * @description 用户退出登录
   */
  const userLogout = async () => {
    try {
      await logout()
    } catch {
      // 不做处理
    }
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
