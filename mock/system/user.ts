import { MockMethod } from 'vite-plugin-mock'
import dayjs from 'dayjs'
import config from '/config/config'
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util'

const { tokenName } = config.defaultSettings

interface RolesInfo {
  roleId: number;
  roleKey: string;
  roleName: string;
  status: string;
}

const accessTokens = {
  gx12358: 'gx-accessToken',
  admin: 'admin-accessToken',
  editor: 'editor-accessToken',
  test: 'test-accessToken'
}

const account = {
  admin: 'gx.design',
  gx12358: 'aa123456',
  editor: 'gx.design',
  test: 'gx.design',
}

export default [
  {
    url: '/mock-server/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { userName, password } = body
      const accessToken = accessTokens[userName]
      if (account[userName] !== password || !accessToken) {
        return {
          code: 500,
          msg: '帐户或密码不正确。'
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: {
          [tokenName]: accessToken,
          expires_in: 720
        }
      }
    }
  },
  {
    url: '/mock-server/socialLogin',
    method: 'post',
    response: ({ body }) => {
      const { code } = body
      if (!code) {
        return {
          code: 500,
          msg: '未成功获取Token。'
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: { accessToken: accessTokens['admin'] }
      }
    }
  },
  {
    url: '/mock-server/register',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '模拟注册成功'
      }
    }
  },
  {
    url: '/mock-server/userInfo',
    method: 'post',
    response: (request) => {
      let GxAccessToken = getRequestToken(request)
      GxAccessToken = 'admin-accessToken'
      let userId: number | null = null
      let roles: string[] = []
      let rolesInfo: RolesInfo[] = []
      let roleIds: number[] = []
      let permissions: string[] = []
      let nickName = ''
      let userName = ''
      for (const i in accessTokens) {
        if (accessTokens[i] === GxAccessToken) userName = i
      }
      switch (GxAccessToken) {
        case 'gx-accessToken':
          userId = 0
          rolesInfo = [
            {
              roleId: 1,
              roleKey: 'gx-admin',
              roleName: 'gx12358-超级管理员',
              status: '0'
            }
          ]
          roles = rolesInfo.map(item => item.roleKey)
          roleIds = rolesInfo.map(item => item.roleId)
          permissions = ['*:*:*']
          nickName = '高翔'
          break
        case 'admin-accessToken':
          userId = 1
          rolesInfo = [
            {
              roleId: 1,
              roleKey: 'admin',
              roleName: '超级管理员',
              status: '0'
            }
          ]
          roles = rolesInfo.map(item => item.roleKey)
          roleIds = rolesInfo.map(item => item.roleId)
          permissions = [
            'proTable:button:add',
            'proTable:button:1',
            'proTable:button:2',
            'proTable:button:3'
          ]
          nickName = '系统管理员'
          break
        case 'editor-accessToken':
          userId = 2
          rolesInfo = [
            {
              roleId: 2,
              roleKey: 'editor',
              roleName: '编辑人员',
              status: '0'
            }
          ]
          roles = rolesInfo.map(item => item.roleKey)
          roleIds = rolesInfo.map(item => item.roleId)
          permissions = []
          userName = 'editor'
          nickName = 'gx12358-editor'
          break
        case 'test-accessToken':
          userId = 3
          rolesInfo = [
            {
              roleId: 1,
              roleKey: 'admin',
              roleName: '超级管理员',
              status: '0'
            },
            {
              roleId: 2,
              roleKey: 'editor',
              roleName: '编辑人员',
              status: '0'
            }
          ]
          roles = rolesInfo.map(item => item.roleKey)
          roleIds = rolesInfo.map(item => item.roleId)
          permissions = [
            'proTable:button:1',
            'proTable:button:2',
            'proTable:button:3'
          ]
          userName = 'test'
          nickName = 'gx12358-test'
          break
        default:
          return {
            code: 500,
            msg: 'token 失效，请重新登录！'
          }
          break
      }
      return {
        code: 200,
        msg: 'success',
        roles,
        permissions,
        user: {
          admin: userId === 0 || userId === 1,
          userId,
          roles: rolesInfo,
          roleIds,
          userName,
          nickName,
          'avatar|1': [
            'https://ahtv-obs.obs.cn-north-4.myhuaweicloud.com/15918_100.gif',
            'https://ahtv-obs.obs.cn-north-4.myhuaweicloud.com/15922_100.gif',
            'https://ahtv-obs.obs.cn-north-4.myhuaweicloud.com/20211111162748.jpg'
          ],
          loginDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      }
    }
  },
  {
    url: '/mock-server/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const { userName } = request.query
      const token = getRequestToken(request)
      if (!token) return resultError('Invalid token')
      const checkUser = accessTokens[userName]
      if (!checkUser) {
        return resultError('Invalid token!')
      }
      return resultSuccess(undefined, { msg: 'Token has been destroyed' })
    }
  }
] as MockMethod[]
