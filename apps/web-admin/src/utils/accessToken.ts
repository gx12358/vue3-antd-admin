import { app } from '@gx-config'
import { CreateAccessToken } from '@gx/access'
import { storage } from './storage'

export const accessToken = new CreateAccessToken({
  ...app.token.storage,
  storage: {
    getItem: props => storage.getStorage(props),
    setItem: props => storage.setStorage(props),
    removeItem: props => storage.removeStorage(props)
  }
})
