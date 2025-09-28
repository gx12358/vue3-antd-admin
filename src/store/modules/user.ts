import { defaultSettings } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { isArray, isNumber, isObject } from '@gx-design-vue/pro-utils'
import { notification } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { getUserInfo, login, logout } from '@/services/userCenter'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { timeFix } from '@/utils/util'
import { useStoreDict } from './dict'
import { useStoreGlobal } from './global'
import { useStorePermission } from './permission'
import { useStoreRoutes } from './routes'

const { loginInterception } = defaultSettings.system

export interface UserState {
  accessToken: string;
  userInfo: UserDetails;
}

// 0 返回登录页 1 成功 2 返回注册页
export type CheckUserStatus = 0 | 1 | 2

export const useStoreUser = defineStore('user', () => {
  const dict = useStoreDict()
  const routes = useStoreRoutes()
  const global = useStoreGlobal()
  const permission = useStorePermission()

  const [ state, setValue ] = useReactiveState<UserState>({
    accessToken: getAccessToken(),
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
    const response: ResponseResult<{ token: string; expiresIn: number }> = await login(params)
    if (response) {
      const accessToken = response.data?.token
      if (accessToken) {
        setValue({ accessToken })
        setAccessToken(accessToken, response.data?.expiresIn ? response.data?.expiresIn * 60 * 1000 : 0)
        return true
      }
    }

    return false
  }

  const updateUserInfo = async (): Promise<CheckUserStatus> => {
    let status: CheckUserStatus = 0
    const response: ResponseResult<null, UserInfo> = await getUserInfo()
    const { user, roles, permissions } = response || {} as UserInfo
    if (response && user && isObject(user)) {
      if (isNumber(user.userId) && roles && isArray(roles)) {
        status = 1
        permission.setValue({ admin: user.admin, role: roles, ability: permissions })
        setValue({ userInfo: { ...user } })
        setTimeout(() => {
          notification.success({
            message: `欢迎登录${state.userInfo.value?.nickName}`,
            description: `${timeFix()}！`
          })
        }, 200)
      }
    }
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
    global.setValue({ isLoggingIn: true })
    if (loginInterception) {
      status = await updateUserInfo()
    } else {
      status = setVirtualUserInfo()
    }
    global.setValue({ isLoggingIn: false })
    return status
  }

  const resetPermissions = () => {
    removeAccessToken()
    setValue({ accessToken: '', userInfo: {} })
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
    await logout()
    resetPermissions()
  }

  return {
    ...state,
    userLogin,
    userLogout,
    setValue,
    resetPermissions,
    checkUserPermission
  }
})
