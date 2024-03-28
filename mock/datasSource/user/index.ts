import { defaultSettings } from '@gx-config'
import { accessTokens, accounts } from '@gx-mock/config/user'
import { createrToken, getMockRequest } from '@gx-mock/util/utils'

const { tokenName } = defaultSettings

export default [
  getMockRequest({
    url: '/user/login',
    method: 'post',
    carryToken: false,
    callback: ({ body }) => {
      const { userName, password } = body
      const accessToken = accessTokens[userName]
      if (accounts[userName] !== password || !accessToken) {
        return {
          code: 500,
          msg: '帐户或密码不正确。'
        }
      }
      return {
        code: 200,
        msg: 'success',
        data: {
          [tokenName]: createrToken(accessToken),
          expiresIn: 720
        }
      }
    }
  }),
  getMockRequest({
    url: '/user/register',
    method: 'post',
    carryToken: false,
    callback: () => {
      return {
        code: 200,
        msg: '模拟注册成功'
      }
    }
  }),
  getMockRequest({
    url: '/user/logout',
    method: 'get',
    timeout: 200
  })
]
