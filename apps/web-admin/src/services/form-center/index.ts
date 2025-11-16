import { requestClient } from '@/services/base'

export * from './advanced'
export * from './step'

export function submitForm(data) {
  return requestClient.post('/form/submit', {
    isMock: true,
    data
  })
}

export function getFormDetails() {
  return requestClient.get('/form/details', {
    isMock: true,
  })
}
