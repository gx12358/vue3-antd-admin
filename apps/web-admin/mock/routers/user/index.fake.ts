import { accessTokens, accounts } from '../../config/user'
import { createMockRoute } from '../../index'
import { createrToken } from '../../utils/util'

export default createMockRoute([
  {
    url: '/user/login',
    method: 'post',
    carryToken: false,
    callback: ({ body }) => {
      const { username, password } = body
      const accessToken = accessTokens[username]
      if (accounts[username] !== password || !accessToken) {
        return {
          code: 500,
          message: '帐户或密码不正确。'
        }
      }
      return {
        code: 200,
        message: 'success',
        data: {
          token: createrToken(accessToken),
          expiresIn: 720
        }
      }
    }
  },
  {
    url: '/user/register',
    method: 'post',
    carryToken: false,
    callback: () => {
      return {
        code: 200,
        message: '模拟注册成功'
      }
    }
  },
  {
    url: '/user/logout',
    method: 'get',
    timeout: 200,
    callback: null
  }
])
