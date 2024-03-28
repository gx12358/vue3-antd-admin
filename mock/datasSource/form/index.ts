import { getMockRequest } from '@gx-mock/util/utils'
import { formState } from '@gx-mock/config/form'

export interface BasicFormState {
  title: string;
  startTime: string;
  endTime: string;
  summary: string;
  metrics: string;
  clientName: string;
  inviter: string;
  weight: number;
  target: 1 | 2 | 3; // 1 公开 2 部分公开 3 不公开
}

export default [
  getMockRequest({
    url: '/form/details',
    method: 'get',
    callback: () => formState
  }),
  getMockRequest({
    url: '/form/submit',
    method: 'post',
    timeout: 500,
    callback: () => ({ data: null })
  }),
]
