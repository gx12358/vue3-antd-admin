import { requestClient } from '@/services/base'

export function getStepForm(params) {
  return requestClient.get('/form/stepForm', {
    isMock: true,
    params
  })
}
