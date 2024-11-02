import type { PiniaStoreValue } from '@gx-design-vue/pro-hooks'
import type { UserDetails, UserInfo } from '@gx-mock/config/user'
import { getUserInfo, login, logout } from '@/services/userCenter'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { timeFix } from '@/utils/util'
import { defaultSettings } from '@gx-config'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import { convertValueBoolean, isObject } from '@gx-design-vue/pro-utils'
import { defaultUser } from '@gx-mock/config/user'
import { notification } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { toRefs } from 'vue'
import { useStorePermission } from './permission'
import { useStoreRoutes } from './routes'

const { tokenName, loginInterception } = defaultSettings

export interface UserState {
  accessToken: string;
  userInfo: UserDetails;
}

type UserStoreValue = PiniaStoreValue<UserState, {
  resetPermissions: () => void
  setValue: (value: Partial<UserState>) => void
  userLogut: () => Promise<void>
  checkUserPremission: () => Promise<boolean>
  userLogin: (params: any) => Promise<boolean>
}>

export const useStoreUser = defineStore<'user', UserStoreValue>('user', () => {
  const routes = useStoreRoutes()
  const permission = useStorePermission()

  const [ state, setValue ] = useReactiveState<UserState>({
    accessToken: getAccessToken(),
    userInfo: {} as UserDetails
  })

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 登录拦截放行时，设置虚拟角色
   */
  const setVirtualUserInfo = () => {
    permission.setValue({ admin: true })
    permission.setValue({ role: defaultUser.roles })
    permission.setValue({ role: defaultUser.permissions })
    setValue({ userInfo: defaultUser.user as UserDetails })
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 登录
   */
  const userLogin = async (params: any): Promise<boolean> => {
    const response: ResponseResult<{ expiresIn: number; }> = await login(params)
    // @ts-ignore
    const accessToken = response?.data?.[tokenName]
    if (accessToken) {
      const expiresIn = response?.data?.expiresIn
      setValue({ accessToken })
      setAccessToken(accessToken, expiresIn ? expiresIn * 60 * 1000 : 0)
      return true
    }
    return false
  }

  const updateUserInfo = async () => {
    const response: ResponseResult<UserInfo> = await getUserInfo()
    const { user, roles, permissions } = response?.data || {} as UserInfo
    if (response && user && isObject(user)) {
      if (user.userName && roles && Array.isArray(roles)) {
        permission.setValue({ role: roles })
        permission.setValue({ ability: permissions })

        setValue({ userInfo: { ...user } })
        notification.success({
          message: `欢迎登录${state.userInfo?.userName}`,
          description: `${timeFix()}！`
        })
      }
    }
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 获取用户信息
   */
  const checkUserPremission = async () => {
    if (loginInterception)
      await updateUserInfo()
    else setVirtualUserInfo()
    return convertValueBoolean(state?.userInfo)
  }

  const resetPermissions = () => {
    setValue({ accessToken: '' })
    removeAccessToken()
    permission.setValue({ admin: false })
    permission.setValue({ role: [] })
    permission.setValue({ role: [] })
    routes.setValue({ routes: [] })
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/5/15
   * @lastTime    2022/5/15
   * @description 用户退出登录
   */
  const userLogut = async () => {
    await logout()
    resetPermissions()
  }

  return {
    ...toRefs(state),
    userLogin,
    userLogut,
    setValue,
    resetPermissions,
    checkUserPremission
  }
})
