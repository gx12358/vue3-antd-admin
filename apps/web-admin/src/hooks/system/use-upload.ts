import type { OssUploadProps } from './use-oss'
import type { ClientDetails, OssMapKey, OssState } from '@/store/modules/oss'
import { requestClient } from '@/services/base'
import { getFilePresignedUrl } from '@/services/system'
import { useOss } from './use-oss'

export interface OssResponse {
  code: 200 | 500;
  url?: string;
  name?: string;
  uploadId?: string;
  previewUrl?: string;
  data?: any;
}

export interface UploadConfig extends Omit<OssUploadProps, 'file'> {
  file: File;
  type?: OssMapKey;
  client?: any;
  checkpoint?: any;
  clientDetils?: ClientDetails & OssState;
  progressCallback?: (progress: number, cpt: any) => void;
}

function handleOssResponse(data: any) {
  try {
    return {
      url: data.requestUrls[0].split('?uploadId=')[0],
      uploadId: data.requestUrls[0].split('?uploadId=')[1]
    }
  } catch {
    return {
      url: '',
      uploadId: ''
    }
  }
}

export function useOssPreview(type: OssMapKey = 'image', url: string, client?: OssState & ClientDetails) {
  const { oss } = useStore()

  let previewUrl = ''
  if (client?.cdn || oss[type]?.cdn) {
    previewUrl = `${client?.cdn || (oss[type]?.cdn)}/${url}`
  }

  return previewUrl
}

export type OssUpload = (options: UploadConfig) => Promise<OssResponse>

export function useUpload() {
  const { createClient, getOssUploadName } = useOss()

  async function simpleUpload(props: UploadConfig) {
    try {
      const result = await getFilePresignedUrl<{
        configId: number; // 文件配置编号
        uploadUrl: string; // 文件上传 URL
        url: string; // 文件 URL
        path: string; // 文件路径
      }>(props.file.name)
      // 1.3 上传文件
      return requestClient
        .put(result.uploadUrl, {
          data: props.file,
          carryToken: false,
          responseReturn: 'raw',
          headers: {
            'Content-Type': props.file.type,
          },
        })
        .then(() => {
          return {
            code: 200,
            url: result.url,
            name: result.path,
            previewUrl: result.url
          }
        })
    } catch {}
  }

  function quickUpload({
    name,
    fullName,
    client,
    file,
    type = 'image',
    clientDetils,
    serverFn
  }: UploadConfig) {
    return new Promise<OssResponse>(async (resolve) => {
      const ossClient = client || await createClient(type, clientDetils)
      const ossName = await getOssUploadName({
        name,
        fullName,
        file,
        serverFn
      })
      ossClient
        .put(ossName, file)
        .then((res: any) => {
          const originInfo = handleOssResponse(res?.res || {})
          if (originInfo.url) {
            const previewUrl = useOssPreview(type, res.name, clientDetils)

            resolve({
              code: 200,
              name: res.name,
              previewUrl,
              ...originInfo
            })
          }
          resolve({
            code: 500,
            data: res
          })
        })
        .catch((e) => {
          resolve({
            code: 500,
            data: e
          })
        })
    })
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/4/22
   * @lastTime    2022/4/22
   * @description 上传文件
   */
  async function upload({
    name,
    fullName,
    client,
    file,
    type = 'image',
    clientDetils,
    progressCallback
  }: UploadConfig) {
    return new Promise<OssResponse>(async (resolve) => {
      const ossClient = client || await createClient(type, clientDetils)
      const ossName = await getOssUploadName({
        name,
        fullName,
        file
      })
      ossClient
        .multipartUpload(ossName, file, {
          progress: (p, cpt) => {
            // 获取上传进度。
            progressCallback && progressCallback(Number((p * 100).toFixed(1)), cpt)
          }
        })
        .then((res) => {
          const originInfo = handleOssResponse(res?.res || {})
          if (originInfo.url) {
            const previewUrl = useOssPreview(type, res.name, clientDetils)

            resolve({
              code: 200,
              previewUrl,
              name: res.name,
              ...originInfo
            })
          }
          resolve({
            code: 500,
            data: res
          })
        })
        .catch((e) => {
          resolve({
            code: 500,
            data: e
          })
        })
    })
  }

  /**
   * @Author      gx12358
   * @DateTime    2022/4/22
   * @lastTime    2022/4/22
   * @description 继续上传
   */
  async function resumeUpload({
    client,
    name,
    file,
    type = 'image',
    clientDetils,
    checkpoint,
    progressCallback
  }: UploadConfig) {
    return new Promise<OssResponse>(async (resolve) => {
      const ossClient = client || await createClient(type, clientDetils)

      ossClient
        .multipartUpload(name, file, {
          checkpoint,
          progress: (p, cpt) => {
            // 获取上传进度。
            progressCallback && progressCallback(Number((p * 100).toFixed(1)), cpt)
          }
        })
        .then((res) => {
          const originInfo = handleOssResponse(res?.res || {})
          if (originInfo.url) {
            const previewUrl = useOssPreview(type, res.name, clientDetils)

            resolve({
              code: 200,
              name: res.name,
              previewUrl,
              ...originInfo
            })
          }
          resolve({
            code: 500,
            data: res
          })
        })
        .catch((e) => {
          resolve({
            code: 500,
            data: e
          })
        })
    })
  }

  return {
    upload,
    simpleUpload,
    quickUpload,
    resumeUpload
  }
}
