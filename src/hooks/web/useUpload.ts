import OSS from 'ali-oss'
import { useStore } from '@gx-vuex'
import { fileName } from '@/utils/uploadFile'

export type UploadConfig = {
  client?: any;
  name?: string;
  file: File;
  checkpoint?: any;
  fullname?: any;
  progressCallback?: (progress: number, cpt: any) => void;
}

export type OssUpload = ({
  client,
  name,
  file,
  progressCallback,
  fullname
}: UploadConfig) => Promise<{ code: number; url?: string; data?: any }>

export function useUpload(): {
  createClent?: () => void;
  getSignUrl?: (info: { name: string; client?: any; expires?: number, process?: string }) => Promise<string>;
  simeUpload: ({ client, name, file, fullname }: UploadConfig) => Promise<{ code: number; url?: string; data?: any }>;
  upload: OssUpload;
  resumeUpload: OssUpload;
} {
  const store = useStore()

  async function createClent(): Promise<any> {
    const details = await store.oss.getOssToken()
    return new OSS(details)
  }

  async function getSignUrl({
    name,
    client,
    expires,
    process
  }): Promise<string> {
    if (!name) return (name || '')
    const ossClient = client || await createClent()
    return await ossClient.signatureUrl(name, { expires: expires || 7200, process })
  }

  function simeUpload({
    name,
    client,
    file,
    fullname
  }: UploadConfig) {
    return new Promise<{ code: number; url?: string; data?: any }>(async (resolve) => {
      const { VITE_OSS_BUCKET } = import.meta.env
      const ossClient = client || await createClent()
      ossClient
        .put(fileName(file, name || VITE_OSS_BUCKET as string, fullname), file)
        .then((res: any) => {
          console.log(res)
          if (res.name) {
            resolve({
              code: 0,
              url: res.name
            })
          }
          resolve({
            code: 500,
            data: res
          })
        })
        .catch(e => {
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
    client,
    file,
    progressCallback,
    fullname
  }: UploadConfig) {
    return new Promise<{ code: number; url?: string; data?: any }>(async (resolve) => {
      const { VITE_OSS_BUCKET } = import.meta.env
      const ossClient = client || await createClent()
      ossClient
        .multipartUpload(fileName(file, name || VITE_OSS_BUCKET as string, fullname), file, {
          progress: (p, cpt) => {
            // 获取上传进度。
            progressCallback && progressCallback(Number((p * 100).toFixed(1)), cpt)
          }
        })
        .then(res => {
          if (res.name) {
            resolve({
              code: 0,
              url: res.name
            })
          }
          resolve({
            code: 500,
            data: res
          })
        })
        .catch(e => {
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
    progressCallback,
    fullname
  }: UploadConfig) {
    return new Promise<{ code: number; url?: string; data?: any }>(async (resolve) => {
      const { VITE_OSS_BUCKET } = import.meta.env
      const ossClient = client || await createClent()
      ossClient
        .multipartUpload(name || fileName(file, VITE_OSS_BUCKET as string, fullname), file, {
          checkpoint,
          progress: (p, cpt) => {
            // 获取上传进度。
            progressCallback && progressCallback(Number((p * 100).toFixed(1)), cpt)
          }
        })
        .then(res => {
          if (res.name) {
            resolve({
              code: 0,
              url: res.name
            })
          }
          resolve({
            code: 500,
            data: res
          })
        })
        .catch(e => {
          resolve({
            code: 500,
            data: e
          })
        })
    })
  }

  return {
    upload,
    getSignUrl,
    simeUpload,
    createClent,
    resumeUpload
  }
}
