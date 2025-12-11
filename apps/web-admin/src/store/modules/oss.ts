import type { ResponseResult } from '@gx/types/request'
import { useReactiveState } from '@gx-design-vue/pro-hooks'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { getOssClient, getUploadInfo } from '@/services/system'

export interface PublicOssUploadInfo {
  pictureUrl1: string
  voiceUrl: string
  videoUrl: string
  pictureCdn: string
  videoCdn: string
  pictureBucket: string
  pictureRegion: string
  videoBucket: string
  videoRegion: string
}

export interface ClientDetails {
  bucket?: string
  fullName?: string
  region?: string
  accessKeyId?: string
  accessKeySecret?: string
  stsToken?: string
  expiration?: string
  securityToken?: string
}

export interface OssState {
  bucket?: string
  region?: string
  cdn?: string
  path?: string
}

export type OssMapKey = 'image' | 'video'

/**
 * @Author      gx12358
 * @DateTime    2022/1/11
 * @lastTime    2022/1/11
 * @description store-oss 数字字典
 */
export type OssInfoState = Record<OssMapKey, ClientDetails & OssState>

const defaultOssState: OssState = {
  bucket: '',
  region: '',
  cdn: '',
  path: ''
}

const defaultOss: OssInfoState = {
  image: cloneDeep(defaultOssState),
  video: cloneDeep(defaultOssState),
}

export const useStoreOss = defineStore('oss', () => {
  const [ state, setState, clear ] = useReactiveState<OssInfoState>(cloneDeep(defaultOss))

  const queryOssToken = async () => {
    try {
      if (!state.image.bucket || !state.video.bucket) {
        const ossBucket: ResponseResult<PublicOssUploadInfo> = await getUploadInfo()
        const {
          videoBucket,
          videoRegion,
          videoCdn,
          videoUrl,
          pictureBucket,
          pictureRegion,
          pictureCdn,
          pictureUrl1
        } = ossBucket.data || {}
        setState({
          image: {
            bucket: pictureBucket,
            region: pictureRegion,
            cdn: pictureCdn,
            path: pictureUrl1
          },
          video: {
            bucket: videoBucket,
            region: videoRegion,
            cdn: videoCdn,
            path: videoUrl
          }
        })
      }
      const response: ResponseResult<ClientDetails> = await getOssClient()
      if (response) {
        const details = response?.data || {}
        if (Object.keys(details).length) {
          const client = {
            stsToken: details.securityToken,
            accessKeyId: details.accessKeyId,
            accessKeySecret: details.accessKeySecret,
            expiration: details.expiration
              ? dayjs(details.expiration).format('YYYY-MM-DD HH:mm:ss')
              : dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
          }
          setState({
            image: cloneDeep(client),
            video: cloneDeep(client),
          })
        }
      }
    } catch {}
  }

  const handleExpired = (date?: string) => {
    if (!date) return false
    const endTime = dayjs(date).subtract(2, 'minute')
    return dayjs().isBefore(endTime)
  }

  const getOssToken = async (type: OssMapKey, extraClient?: ClientDetails): Promise<ClientDetails> => {
    let client = state[type]
    if (client.stsToken && handleExpired(client.expiration)) {
      return { ...client, ...extraClient }
    }

    // 过期重新获取
    await queryOssToken()
    client = state[type]
    return { ...client, ...extraClient }
  }

  return {
    ...toRefs(state),
    setState,
    clear,
    getOssToken,
    queryOssToken
  }
})
