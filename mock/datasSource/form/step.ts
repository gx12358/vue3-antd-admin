import { getMockRequest } from '@gx-mock/util/utils'

export default [
  getMockRequest({
    url: '/form/stepForm',
    method: 'get',
    timeout: 200,
    callback: () => ({
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500000000',
      receiverMode: 'alipay'
    })
  })
]
