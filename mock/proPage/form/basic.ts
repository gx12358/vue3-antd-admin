import { MockMethod } from 'vite-plugin-mock'
import dayjs from 'dayjs'
import { builder, getRequestToken, requestParams } from '../../_util'
import { cloneDeep } from 'lodash-es'

export default [
  {
    url: '/mock-server/basicForm',
    method: 'post',
    response: (request: requestParams) => {
      return builder(getRequestToken(request), {
        data: cloneDeep({
          title: '测试表单',
          startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
          goal: '赚钱',
          standard: '厉害',
          client: 'sf12358',
          invites: 'gx12358',
          weight: '80',
          publicType: '2',
          publicUsers: '1'
        })
      })
    }
  }
] as MockMethod[]
