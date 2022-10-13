import { MockMethod } from 'vite-plugin-mock'
import { cloneDeep } from 'lodash-es'
import { getRequestToken, requestParams, builder } from '../../_util'

const advancedTableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park'
  }
]

export default [
  {
    url: '/mock-server/advancedForm',
    method: 'post',
    response: (request: requestParams) => {
      return builder(getRequestToken(request), {
        data: {}
      })
    }
  },
  {
    url: '/mock-server/advancedFormTable',
    method: 'post',
    response: (request: requestParams) => {
      return builder(getRequestToken(request), {
        data: cloneDeep(advancedTableData)
      })
    }
  },
  {
    url: '/mock-server/advancedFormTable/delete',
    method: 'post',
    response: (request: requestParams) => {
      const { id } = request.body
      return builder(getRequestToken(request), {
        data: cloneDeep(advancedTableData).filter(item => item.key !== id),
        code: id ? 200 : 500
      })
    }
  }
] as MockMethod[]
