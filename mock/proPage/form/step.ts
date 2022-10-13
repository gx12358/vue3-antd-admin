import { MockMethod } from 'vite-plugin-mock'
import { builder, getRequestToken, requestParams } from '../../_util'
import { cloneDeep } from 'lodash-es'

export default [
  {
    url: '/mock-server/stepForm',
    method: 'post',
    response: (request: requestParams) => {
      return builder(getRequestToken(request), {
        data: cloneDeep({
          payAccount: 'ant-design@alipay.com',
          receiverAccount: 'test@example.com',
          receiverName: 'Alex',
          amount: '500000000',
          receiverMode: 'alipay'
        })
      })
    }
  }
] as MockMethod[]
