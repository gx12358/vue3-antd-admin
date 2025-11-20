import type { GetItemProps, LocalStorageKey, RemoveItemProps, SetItemProps } from '@gx-core/shared/cache'
import { CreateStorage } from '@gx-core/shared/cache'

export interface AccsssTokenProps {
  name: string;
  refreshName: string;
  type: LocalStorageKey

  storage: {
    setItem: (props: SetItemProps) => void;
    getItem: (props: GetItemProps) => any;
    removeItem: (props: RemoveItemProps) => any;
  }
}

const storage = new CreateStorage()

class CreateAccessToken {
  public options: AccsssTokenProps = {
    type: 'localStorage',
    name: 'console_token',
    refreshName: 'refresh_token',

    storage: {
      setItem: props => storage.setStorage(props),
      getItem: props => storage.getStorage(props),
      removeItem: props => storage.removeStorage(props),
    }
  }

  constructor(props?: Partial<AccsssTokenProps>) {
    this.options = { ...this.options, ...(props ?? {}) }
  }

  /**
   * @Author      gx12358
   * @DateTime    2021/12/27
   * @lastTime    2021/12/27
   * @description 获取Token
   */
  getAccessToken() {
    const { name, refreshName, type, storage } = this.options
    return {
      token: storage.getItem({ key: name, isOrigin: true, type, encryption: false }),
      refreshToken: storage.getItem({ key: refreshName, isOrigin: true, type, encryption: false }),
    }
  }

  /**
   * @author gx12358 2539306317@qq.com
   * @description 存储Token
   * @param token | refreshToken
   * @returns {void|*}
   */
  setAccessToken({ token, refreshToken }: { token: string; refreshToken?: string; expiresTime?: number }) {
    const { name, refreshName, type, storage } = this.options
    if (refreshToken) {
      storage.setItem({
        key: refreshName,
        isOrigin: true,
        encryption: false,
        value: refreshToken,
      })
    }
    storage.setItem({
      key: name,
      type,
      isOrigin: true,
      encryption: false,
      value: token,
    })
  }

  /**
   * @author gx12358 2539306317@qq.com
   * @description 移除Token
   * @returns {void|Promise<void>}
   */
  removeAccessToken() {
    const { name, refreshName, type, storage } = this.options
    storage.removeItem({ key: name, isOrigin: true, type })
    storage.removeItem({ key: refreshName, isOrigin: true, type })
  }
}

export {
  CreateAccessToken
}
