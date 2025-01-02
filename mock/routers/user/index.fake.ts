import { createMockRoute } from '@gx-mock'
import { accessTokens, accounts } from '@gx-mock/config/user'
import { createrToken } from '@gx-mock/utils/util'

export default createMockRoute([
  {
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
        msg: '模拟注册成功'
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
