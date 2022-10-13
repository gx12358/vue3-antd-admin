import { reactive, toRefs } from 'vue'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { getOssClient } from '@/services/oss'

export type ClientDetails = {
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  accessKeySecret?: string;
  stsToken?: string;
  expiration?: string;
  securityToken?: string;
}

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-oss 数字字典
 */
export interface OssState {
  clientDetails: Partial<ClientDetails>;
}

export const useStoreOss = defineStore('oss', () => {
  const state = reactive<OssState>({
    clientDetails: {}
  })

  const queryOssToken = async () => {
    const response: ResponseResult<ClientDetails> = await getOssClient()
    if (response) {
      const { VITE_OSS_BUCKET, VITE_OSS_ORIGIN } = import.meta.env
      const details = response?.data || {}
      if (Object.keys(details).length) {
        state.clientDetails = {
          stsToken: details.securityToken,
          accessKeyId: details.accessKeyId,
          accessKeySecret: details.accessKeySecret,
          expiration: details.expiration
            ? dayjs(details.expiration).format('YYYY-MM-DD HH:mm:ss')
            : dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
          bucket: VITE_OSS_BUCKET as string,
          region: VITE_OSS_ORIGIN as string
        }
      }
    }
  }

  const getOssToken = async () => {
    if (state.clientDetails.stsToken && handleExpired(state.clientDetails.expiration)) {
      return state.clientDetails
    }
    await queryOssToken()
    return state.clientDetails
  }

  const handleExpired = (date: string) => {
    const endTime = dayjs(date).subtract(2, 'minute')
    return dayjs().isBefore(endTime)
  }

  const clearOss = () => {
    state.clientDetails = {}
  }

  return {
    ...toRefs(state),
    clearOss,
    getOssToken,
    queryOssToken
  }
})
