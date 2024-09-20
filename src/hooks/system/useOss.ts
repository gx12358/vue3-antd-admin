import type { ClientDetails } from '@/store/modules/oss'
import { getUplaodInfos } from '@/services/systemCenter'
import { createFileName } from '@/utils/uploadFile'
import { checkURL } from '@/utils/validate'
import { checkFileType, getFileSuffix, isArray } from '@gx-design-vue/pro-utils'
import OSS from 'ali-oss'
import { cloneDeep } from 'lodash-es'

export function useOss() {
  const store = useStore()

  async function createClent(params?: ClientDetails): Promise<any> {
    const details = await store.oss.getOssToken(params)
    return new OSS(details)
  }

  async function getSignUrl({
    name,
    params,
    client,
    expires,
    process
  }: {
    name: string;
    client?: any;
    params?: ClientDetails;
    expires?: number;
    process?: string;
  }): Promise<string> {
    if (!name || checkURL(name)) {
      return name && process ? `${name}?x-oss-process=${process}` : name
    }
    const ossClient = client || await createClent(params)
    return await ossClient.signatureUrl(name, { expires: expires || 7200, process })
  }

  async function getArraySignUrl<T = any>({ data, type, key }: {
    data: T[];
    type?: string | string[];
    key?: string | string[];
  }) {
    for (let i = 0; i < data.length; i += 1) {
      if (isArray(type)) {
        for (let a = 0; a < (type as string[]).length; a += 1) {
          let ossViewUrl = data[i][type[a]]
          if (!checkURL(data[i][type[a]])) {
            ossViewUrl = await getSignUrl({
              name: data[i][type[a]]
            })
          }
          data[i][key[a] || 'ossViewUrl'] = ossViewUrl
        }
      } else if (type) {
        let ossViewUrl = data[i][type as string]
        if (!checkURL(data[i][type as string])) {
          ossViewUrl = await getSignUrl({
            name: data[i][type as string]
          })
        }
        data[i][(key as string) || 'ossViewUrl'] = ossViewUrl
      } else {
        let ossViewUrl = data[i] as any
        if (!checkURL(data[i])) {
          ossViewUrl = await getSignUrl({
            name: data[i] as any
          })
        }
        data[i] = ossViewUrl
      }
    }
    return cloneDeep(data)
  }

  async function getUploadName({
    file,
    fileName
  }: {
    file: File;
    fileName?: string;
  }) {
    let name = fileName
    const response: ResponseResult<{
      videoUrl: string;
      pictureUrl1: string;
    }> = await getUplaodInfos()
    if (response) {
      const url = file instanceof File ? file.name : file
      const infos = response.data
      name = `${checkFileType(url) === '1'
        ? infos.pictureUrl1
        : infos.videoUrl}.${getFileSuffix(url)}`
    }
    return name
  }

  async function getOssUploadName({
    name,
    fullName,
    file
  }) {
    if (fullName)
      return fullName
    const fileName = await getUploadName({
      file,
      fileName: name
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
    createClent,
    getOssUploadName
  }
}
