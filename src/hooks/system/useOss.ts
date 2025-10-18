import type { ClientDetails, OssMapKey } from '@/store/modules/oss'
import { checkFileType, getFileSuffix, isArray } from '@gx-design-vue/pro-utils'
import OSS from 'ali-oss'
import { cloneDeep } from 'lodash-es'
import { getUploadInfo } from '@/services/systemCenter'
import { createFileName } from '@/utils/uploadFile'
import { checkURL } from '@/utils/validate'

export interface OssUploadProps {
  name?: string;
  fullName?: string,
  file: File | string,
  serverFn?: Fn;
}

export function useOss() {
  const { oss } = useStore()

  async function createClient(type: OssMapKey = 'image', params?: ClientDetails): Promise<any> {
    const details = await oss.getOssToken(type, params)
    return new OSS(details)
  }

  async function getSignUrl({
    name,
    type,
    params,
    client,
    expires,
    process
  }: {
    name: string;
    type?: OssMapKey;
    client?: any;
    params?: ClientDetails;
    expires?: number;
    process?: string;
  }): Promise<string> {
    if (!name || checkURL(name)) {
      return name && process ? `${name}?x-oss-process=${process}` : name
    }
    const ossClient = client || await createClient(type, params)
    return await ossClient.signatureUrl(name, { expires: expires || 7200, process })
  }

  async function getArraySignUrl<T = any>({ data, type, key, ossType }: {
    data: T[];
    ossType?: OssMapKey,
    type?: string | string[];
    key?: string | string[];
  }) {
    for (let i = 0; i < data.length; i += 1) {
      if (isArray(type) && type) {
        for (let a = 0; a < type.length; a += 1) {
          let ossViewUrl = data[i][type[a]]
          if (!checkURL(data[i][type[a]])) {
            ossViewUrl = await getSignUrl({
              name: data[i][type[a]],
              type: ossType
            })
          }
          if (key) {
            data[i][key[a] || 'ossViewUrl'] = ossViewUrl
          }
        }
      } else if (type) {
        let ossViewUrl = data[i][type as string]
        if (!checkURL(data[i][type as string])) {
          ossViewUrl = await getSignUrl({
            name: data[i][type as string],
            type: ossType
          })
        }
        data[i][(key as string) || 'ossViewUrl'] = ossViewUrl
      } else {
        let ossViewUrl = data[i] as any
        if (!checkURL(data[i])) {
          ossViewUrl = await getSignUrl({
            name: data[i] as any,
            type: ossType
          })
        }
        data[i] = ossViewUrl
      }
    }
    return cloneDeep(data)
  }

  async function getUploadName({
    file,
    fileName,
    serverFn
  }: {
    file: File | string;
    serverFn?: Fn;
    fileName?: string;
  }) {
    let name = fileName
    try {
      if (serverFn) {
        name = await serverFn()
      } else {
        const response: ResponseResult<{
          videoUrl: string;
          pictureUrl1: string;
        }> = await getUploadInfo()
        if (response) {
          const url = file instanceof File ? file.name : file
          const infos = response.data
          name = `${checkFileType(url) === '1' ? infos?.pictureUrl1 : infos?.videoUrl}.${getFileSuffix(
            url)}`
        }
      }
    } catch {}
    return name
  }

  async function getOssUploadName({
    name,
    fullName,
    file,
    serverFn
  }: OssUploadProps) {
    if (fullName)
      return fullName
    const fileName = await getUploadName({
      file,
      fileName: name,
      serverFn
    })

    return createFileName({
      file,
      name: fileName
    })
  }

  return {
    getSignUrl,
    getUploadName,
    getArraySignUrl,
    createClient,
    getOssUploadName
  }
}
