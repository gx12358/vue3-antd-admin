import { MockMethod } from 'vite-plugin-mock'
import { getRequestToken, requestParams, builder } from '../_util'

export default [
  {
    url: '/mock-server/form',
    method: 'post',
    response: (request: requestParams) => {
      return builder(getRequestToken(request), {
        data: {
          name: '蚂蚁设计有限公司',
          useMode: 'chapter'
        }
      })
    }
  }
] as MockMethod[]
