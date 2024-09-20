import type { UserDetails, UserInfo } from '@gx-mock/config/user'
import { getUserInfo, login, logout } from '@/services/userCenter'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { timeFix } from '@/utils/util'
import { defaultSettings } from '@gx-config'
import { isObject } from '@gx-design-vue/pro-utils'
import { defaultUser } from '@gx-mock/config/user'
import { notification } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { useStorePermission } from './permission'
import { useStoreRoutes } from './routes'

const { tokenName, loginInterception } = defaultSettings

export interface UserState {
  accessToken: string;
  userInfo: UserDetails;
}

type UserStateKey = keyof UserState

export const useStoreUser = defineStore('user', () => {
  const routes = useStoreRoutes()
  const auth = useStorePermission()

  const state = reactive<UserState>({
    accessToken: getAccessToken(),
    userInfo: {} as UserDetails
  })

  const userDetails = computed<UserDetails>(() => state.userInfo)

  const setState: (params: Partial<Record<UserStateKey, UserState[UserStateKey]>>) => void = (params) => {
    Object.assign(state, params)
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 登录拦截放行时，设置虚拟角色
   */
  const setVirtualUserInfo = () => {
    auth.changeValue('admin', true)
    auth.changeValue('role', defaultUser.roles)
    auth.changeValue('ability', defaultUser.permissions)
    setState({
      userInfo: defaultUser.user as UserDetails
    })
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 登录
   */
  const userLogin = async (params): Promise<boolean> => {
    const response: ResponseResult<{ expiresIn: number; }> = await login(params)
    const accessToken = response?.data?.[tokenName]
    if (accessToken) {
      const expiresIn = response?.data?.expiresIn
      state.accessToken = accessToken
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
        auth.changeValue('role', roles)
        auth.changeValue('ability', permissions)

        setState({
          userInfo: cloneDeep(user)
        })
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
    return Object.keys(state.userInfo).length
  }

  const resetPermissions = () => {
    state.accessToken = ''
    removeAccessToken()
    auth.changeValue('admin', false)
    auth.changeValue('role', [])
    auth.changeValue('ability', [])
    routes.resetRoute()
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
    userDetails,
    userLogin,
    userLogut,
    setState,
    resetPermissions,
    checkUserPremission
  }
})
