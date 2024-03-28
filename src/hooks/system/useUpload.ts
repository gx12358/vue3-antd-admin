import { useOss } from './useOss'

export interface OssResponse {
  code: number;
  url?: string;
  name?: string;
  uploadId?: string;
  data?: any;
}

export interface UploadConfig {
  client?: any;
  name?: string;
  fullName?: string
  file: File;
  type: 'image' | 'video';
  checkpoint?: any;
  serverKey?: 'create' | 'content';
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

export type OssUpload = ({
  client,
  name,
  file,
  progressCallback
}: UploadConfig) => Promise<OssResponse>

export function useUpload(): {
  simeUpload: ({ client, name, file }: UploadConfig) => Promise<OssResponse>;
  upload: OssUpload;
  resumeUpload: OssUpload;
} {
  const { createClent, getOssUploadName } = useOss()

  function simeUpload({
    name,
    fullName,
    client,
    file
  }: UploadConfig) {
    return new Promise<OssResponse>(async (resolve) => {
      const ossClient = client || await createClent()
      const ossName = await getOssUploadName({
        name,
        fullName,
        file
      })
      ossClient
        .put(ossName, file)
        .then((res: any) => {
          const originInfo = handleOssResponse(res?.res || {})
          if (originInfo.url) {
            resolve({
              code: 0,
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
   * @description 上传文件
   */
  async function upload({
    name,
    fullName,
    client,
    file,
    progressCallback
  }: UploadConfig) {
    return new Promise<OssResponse>(async (resolve) => {
      const ossClient = client || await createClent()
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
            resolve({
              code: 0,
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
    checkpoint,
    progressCallback
  }: UploadConfig) {
    return new Promise<OssResponse>(async (resolve) => {
      const ossClient = client || await createClent()
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
            resolve({
              code: 0,
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

  return {
    upload,
    simeUpload,
    resumeUpload
  }
}
