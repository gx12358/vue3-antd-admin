import { MockMethod } from 'vite-plugin-mock'
import { cloneDeep } from 'lodash-es'
import { builder, getRequestToken, requestParams } from '../_util'

function getCommonStatus() {
  return [
    {
      createBy: 'admin',
      createTime: '2021-10-20 15:03:10',
      cssClass: '',
      default: false,
      dictCode: 27,
      dictLabel: '成功',
      dictSort: 1,
      dictType: 'sys_common_status',
      dictValue: '0',
      isDefault: 'N',
      listClass: 'processing',
      params: {},
      remark: '正常状态',
      searchValue: null,
      status: '0',
      updateBy: null,
      updateTime: null
    },
    {
      createBy: 'admin',
      createTime: '2021-10-20 15:03:10',
      cssClass: '',
      default: false,
      dictCode: 28,
      dictLabel: '失败',
      dictSort: 2,
      dictType: 'sys_common_status',
      dictValue: '1',
      isDefault: 'N',
      listClass: 'error',
      params: {},
      remark: '停用状态',
      searchValue: null,
      status: '0',
      updateBy: null,
      updateTime: null
    }
  ]
}

export default [
  {
    url: '/mock-server/dict/data/type/sys_common_status',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request)
      return builder(token, {
        data: cloneDeep(getCommonStatus())
      })
    }
  }
] as MockMethod[]
