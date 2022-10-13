import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { message, notification } from 'ant-design-vue'
import config from '/config/config'
import { getUserInfo, login, logout } from '@/services/controller/user'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { timeFix } from '@/utils/util'
import { useStoreRoutes } from './routes'
import { useStorePermission } from './permission'
import { useStoreTabsRouter } from './tabsRouter'

const { tokenName } = config.defaultSettings

interface RolesInfo {
  roleId: number;
  roleKey: string;
  roleName: string;
  status: string;
}

export interface UserInfo {
  admin?: boolean;
  userId?: number;
  roles?: RolesInfo[];
  roleIds?: number[];
  userName?: string;
  nickName?: string;
  avatar?: string;
  loginDate?: string;
}

export interface UserState {
  accessToken: string;
  userInfo: UserInfo;
  userName: string;
  loginName: string;
  avatar: string;
}

export const useStoreUser = defineStore('user', () => {
  const routes = useStoreRoutes()
  const auth = useStorePermission()
  const tabsRouter = useStoreTabsRouter()

  const state = reactive({
    accessToken: getAccessToken(),
    userInfo: {},
    userName: '',
    loginName: '',
    avatar: ''
  } as UserState)

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 登录拦截放行时，设置虚拟角色
   */
  const setVirtualRoles = () => {
    auth.changeValue('admin', true)
    state.avatar = 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif'
    state.userName = 'admin(未开启登录拦截)'
    return true
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 登录
   */
  const userLogin = async (params) => {
    const response: any = await login(params)
    const accessToken = response?.data?.[tokenName]
    if (accessToken) {
      const expires_in = response?.data?.expires_in
      state.accessToken = accessToken
      setAccessToken(accessToken, expires_in ? expires_in * 60 * 1000 : 0)
      return true
    }
    return false
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/1/11
   * @lastTime    2022/1/11
   * @description 获取用户信息
   */
  const queryUserInfo = async () => {
    const response: any = await getUserInfo()
    const { roles, user, permissions } = response
    if (!user || Object.keys(user).length === 0) {
      message.error(`验证失败，请重新登录...`)
      return false
    }
    const { userName, avatar, nickName } = user as UserInfo
    if (userName && roles && Array.isArray(roles)) {
      auth.changeValue('role', roles)
      auth.changeValue('ability', permissions)
      state.userName = userName
      state.loginName = nickName
      state.avatar = avatar
      state.userInfo = user
      notification.success({
        message: `欢迎登录${userName}`,
        description: `${timeFix()}！`
      })
    } else {
      message.error('用户信息接口异常')
      return false
    }
    return true
  }

  const updateUserInfo = (params: UserInfo) => {
    Object.assign(state.userInfo, { ...params })
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/5/15
   * @lastTime    2022/5/15
   * @description 用户退出登录
   */
  const userLogut = async () => {
    await logout({
      userName: state.userName
    })
    resetPermissions()
  }

  const resetPermissions = () => {
    state.accessToken = ''
    setAccessToken('')
    auth.changeValue('admin', false)
    auth.changeValue('role', [])
    auth.changeValue('ability', [])
    routes.resetRoute()
    tabsRouter.blankingTabs()
    removeAccessToken()
  }

  return {
    ...toRefs(state),
    userLogin,
    userLogut,
    queryUserInfo,
    updateUserInfo,
    setVirtualRoles,
    resetPermissions
  }
})
