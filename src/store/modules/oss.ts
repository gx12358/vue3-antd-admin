import { reactive, toRefs } from 'vue'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { getUplaodInfos, getOssClient } from '@/services/systemCenter'
import { typeViteEnv } from '@/utils/env'

export type ClientDetails = {
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  accessKeySecret?: string;
  stsToken?: string;
  expiration?: string;
  securityToken?: string;
}

type OssState = {
  bucket: string,
  region: string,
}

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-oss 数字字典
 */
export interface OssInfoState {
  ossInfos: OssState;
  ossClient: Partial<ClientDetails>;
  clientDetails: Partial<ClientDetails>;
}

export const useStoreOss = defineStore('oss', () => {
  const state = reactive<OssInfoState>({
    ossInfos: {
      bucket: '',
      region: ''
    },
    ossClient: {},
    clientDetails: {},
  })

  const queryOssToken = async () => {
    if (!state.ossInfos.bucket && !state.ossInfos.region) {
      const ossBucket: ResponseResult<{
        bucket: string;
        region: string;
      }> = await getUplaodInfos()
      state.ossInfos.bucket = ossBucket.data?.bucket || typeViteEnv('VITE_OSS_BUCKET')
      state.ossInfos.region = ossBucket.data?.region || typeViteEnv('VITE_OSS_ORIGIN')
    }
    const response: ResponseResult<ClientDetails> = await getOssClient()
    if (response) {
      const details = response?.data || {}
      if (Object.keys(details).length) {
        state.clientDetails = {
          stsToken: details.securityToken,
          accessKeyId: details.accessKeyId,
          accessKeySecret: details.accessKeySecret,
          expiration: details.expiration
            ? dayjs(details.expiration).format('YYYY-MM-DD HH:mm:ss')
            : dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
        }
        initClient()
      }
    }
  }

  const initClient = () => {
    state.ossClient = {
      ...state.clientDetails,
      ...state.ossInfos
    }
  }

  const getOssToken = async (params?: ClientDetails) => {
    if (state.clientDetails.stsToken && handleExpired(state.clientDetails.expiration)) {
      return { ...state.clientDetails, ...(params || {}) }
    }
    await queryOssToken()
    return { ...state.clientDetails, ...(params || {}) }
  }

  const handleExpired = (date: string) => {
    const endTime = dayjs(date).subtract(2, 'minute')
    return dayjs().isBefore(endTime)
  }

  const clearOss = () => {
    state.ossClient = {}
    state.clientDetails = {}
  }

  return {
    ...toRefs(state),
    clearOss,
    getOssToken,
    queryOssToken
  }
})
