import { useReactiveState } from '@gx-design-vue/pro-hooks'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { getOssClient, getUplaodInfos } from '@/services/systemCenter'

export interface ClientDetails {
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  accessKeySecret?: string;
  stsToken?: string;
  expiration?: string;
  securityToken?: string;
}

interface OssState {
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
  const [ state, setValue ] = useReactiveState<OssInfoState>({
    ossInfos: {
      bucket: '',
      region: ''
    },
    ossClient: {},
    clientDetails: {}
  })

  const initClient = () => {
    setValue({
      ossClient: {
        ...state.clientDetails,
        ...state.ossInfos
      }
    })
  }

  const queryOssToken = async () => {
    if (!state.ossInfos.value.bucket && !state.ossInfos.value.region) {
      const ossBucket: ResponseResult<{
        bucket: string;
        region: string;
      }> = await getUplaodInfos()
      setValue({
        ossInfos: {
          bucket: ossBucket.data?.bucket,
          region: ossBucket.data?.region
        }
      })
    }
    const response: ResponseResult<ClientDetails> = await getOssClient()
    if (response) {
      const details = response?.data || {}
      if (Object.keys(details).length) {
        setValue({
          clientDetails: {
            stsToken: details.securityToken,
            accessKeyId: details.accessKeyId,
            accessKeySecret: details.accessKeySecret,
            expiration: details.expiration
              ? dayjs(details.expiration).format('YYYY-MM-DD HH:mm:ss')
              : dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
          }
        })
        initClient()
      }
    }
  }

  const handleExpired = (date?: string) => {
    if (!date) return false
    const endTime = dayjs(date).subtract(2, 'minute')
    return dayjs().isBefore(endTime)
  }

  const getOssToken = async (params: ClientDetails = {}): Promise<ClientDetails> => {
    if (state.clientDetails.value.stsToken && handleExpired(state.clientDetails.value.expiration)) {
      return { ...state.clientDetails, ...params }
    }
    await queryOssToken()
    return { ...state.clientDetails, ...params }
  }

  const clearOss = () => {
    setValue({
      ossClient: {},
      clientDetails: {}
    })
  }

  return {
    ...state,
    setValue,
    clearOss,
    getOssToken,
    queryOssToken
  }
})
