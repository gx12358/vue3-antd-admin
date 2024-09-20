import type { Ref } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import {
  checkFileType,
  generateVidoePicture,
  getFileSuffix,
  getMediaInfos,
  getRandomNumber
} from '@gx-design-vue/pro-utils'
import { Modal } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { createVNode, onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useOss } from './useOss'

export interface UploadItem {
  id: string;
  name: string;
  fileName: string;
  title?: string;
  suffix?: string;
  size: number;
  file?: File;
  status: 'prepare' | 'uploading' | 'failed' | 'success' | 'warehousing';
  failedCode?: 0 | 1; // 0 上传失败 1 入库失败
  failedMsg?: string;
  url?: string;
  ossUrl?: string;
  progress?: number;
  width?: number;
  height?: number;
  duration?: number;
  coverImage?: string;
  ossClient?: any;
  checkpoint?: string;
}

export interface UploadConfig {
  uid?: string;
  client?: any;
  name?: string;
  fullName?: string
  file: File;
  checkpoint?: any;
  successCallback?: (params: Partial<UploadItem>) => Promise<{ success: boolean; params?: any }>;
  finalCallBack?: (key: string) => void;
  progressCallback?: (progress: number, cpt: any) => void;
}

const confirmStatus = [
  {
    name: 'uploading',
    msg: '视频正在上传中，删除后需重新上传！'
  },
  {
    name: 'warehousing',
    msg: '视频正在入库中，删除后需重新上传'
  },
  {
    name: 'success',
    msg: '视频还没有处理，删除后需重新上传！'
  }
]

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

export function useListUpload(limit?: Ref<number>) {
  const { createClent, getSignUrl, getOssUploadName } = useOss()

  const dataList = ref<Partial<UploadItem[]>>([])

  const clearData = () => {
    dataList.value.forEach((item) => {
      item.ossClient && item.ossClient?.cancel()
    })
    dataList.value = []
  }

  onMounted(() => {
    clearData()
    window.addEventListener('beforeunload', (e) => {
      if (dataList.value.some(item => item.status === 'uploading' || item.status === 'success')) {
        e.returnValue = '离开当前页面后需重新上传，确定要离开吗?'
      }
    })
  })

  onBeforeRouteLeave((_to, _form, next) => {
    if (dataList.value.some(item => (item.status === 'uploading' || item.status === 'success'))) {
      const status = dataList.value.find(item => (item.status === 'uploading' || item.status === 'success')).status
      Modal.confirm({
        title: '温馨提醒',
        icon: createVNode(ExclamationCircleOutlined),
        content: status === 'uploading'
          ? '当前还有视频正在上传中，是否离开当前页面?'
          : '已上传的视频还未进行处理，退出后已上传的视频将不会保存，是否继续留在当前页面？',
        onOk: () => {
          clearData()
          next()
        },
        cancelText: status === 'uploading' ? '取消' : '留在这里',
        okText: status === 'uploading' ? '离开' : '退出'
      })
    } else {
      next()
    }
  })

  const changeListItem = (key: string, params: Partial<UploadItem>) => {
    dataList.value = dataList.value.map((item) => {
      if (item.id === key) {
        Object.assign(item, params)
      }
      return item
    })
  }

  const getFileConfig = async (file: File, key: string) => {
    getMediaInfos({ url: file, fileType: checkFileType(file.name) }).then(({
      play, width = 0, height = 0, duration = 0
    }) => {
      changeListItem(key, {
        width,
        height,
        duration
      })
      if (play) {
        generateVidoePicture(URL.createObjectURL(file)).then((coverImage) => {
          changeListItem(key, {
            coverImage
          })
        })
      }
    })
  }

  const getListItem = (key: string) => {
    return dataList.value.find(item => item.id === key)
      ? cloneDeep(dataList.value.find(item => item.id === key)) : null
  }

  const addListItem = (file: File, name, ossClient) => {
    if (dataList.value.length >= (limit.value || 5))
      return
    const id = getRandomNumber().uuid(15)
    const fileName = file.name.substring(0, file.name.lastIndexOf('.'))
    dataList.value.push({
      id,
      file,
      fileName,
      suffix: getFileSuffix(file.name).toLowerCase(),
      status: 'prepare',
      name,
      ossClient,
      size: file.size
    })
    return id
  }

  const clearItems = (keys: string[]) => {
    dataList.value = dataList.value.map((item) => {
      if (keys.includes(item.id))
        item.ossClient && item.ossClient?.cancel()
      return item
    }).filter(el => !keys.includes(el.id))
  }

  const confirmClear = (status: UploadItem['status'], callback, finalCallBck?: () => void) => {
    const messageContent = confirmStatus.find(item => item.name === status)?.msg || ''
    if (messageContent) {
      Modal.confirm({
        title: '温馨提醒',
        content: messageContent,
        icon: createVNode(ExclamationCircleOutlined),
        okText: '确定',
        cancelText: '取消',
        onOk() {
          callback()
          finalCallBck && finalCallBck?.()
        }
      })
    } else {
      callback()
    }
  }

  const removeListItem = (key: string, isConfirm?: boolean) => {
    if (isConfirm) {
      const record = getListItem(key)
      confirmClear(record.status, () => clearItems([ key ]))
    } else {
      clearItems([ key ])
    }
  }

  const batchRemoveListItem = (keys: string[], isConfirm: boolean, finalCallBck?: () => void) => {
    if (isConfirm) {
      const record = dataList.value.filter(item => keys.includes(item.id))
        .find(item => confirmStatus.some(el => el.name === item.status))
      confirmClear(record?.status || null, () => clearItems(keys), finalCallBck)
    } else {
      clearItems(keys)
    }
  }

  const uploadFile = async ({
    name,
    fullName,
    client,
    file,
    successCallback,
    finalCallBack,
    progressCallback
  }: UploadConfig) => {
    const ossClient = client || await createClent()
    const ossName = await getOssUploadName({
      name,
      fullName,
      file
    })
    const uid = addListItem(file, ossName, ossClient)
    getFileConfig(file, uid)
    ossClient
      .multipartUpload(ossName, file, {
        progress: (p, cpt) => {
          const progressNum = Number((p * 100).toFixed(1))
          changeListItem(uid, {
            status: 'uploading',
            progress: progressNum,
            checkpoint: cpt
          })
          progressCallback && progressCallback(progressNum, cpt)
        }
      })
      .then(async (res) => {
        const originInfo = handleOssResponse(res?.res || {})
        if (originInfo.url) {
          const ossUrl = await getSignUrl({
            name: res.name
          })
          changeListItem(uid, {
            url: res.name,
            ossUrl
          })
          const warehousingParams: Partial<UploadItem> = {
            status: 'success'
          }

          // 上传成功后业务逻辑
          if (successCallback) {
            changeListItem(uid, {
              status: 'warehousing'
            })
            const { success, params } = await successCallback?.(getListItem(uid))
            warehousingParams.status = success ? 'success' : 'failed'
            if (success) {
              if (params)
                changeListItem(uid, params)
            } else {
              warehousingParams.failedCode = 1
              warehousingParams.failedMsg = '入库失败，请重新上传！'
            }
          }

          changeListItem(uid, warehousingParams)

          if (finalCallBack)
            finalCallBack?.(uid)
        } else {
          changeListItem(uid, {
            failedCode: 0,
            status: 'failed',
            failedMsg: '上传失败，请重新上传！'
          })
        }
      })
      .catch((e) => {
        changeListItem(uid, {
          failedCode: 0,
          status: 'failed',
          failedMsg: e
        })
      })
  }

  async function resumeUpload({
    uid,
    client,
    name,
    file,
    successCallback,
    progressCallback
  }: UploadConfig) {
    const { checkpoint, ossClient } = getListItem(uid)
    const resumeClient = ossClient || client || await createClent()
    resumeClient
      .multipartUpload(name, file, {
        checkpoint,
        progress: (p, cpt) => {
          const progressNum = Number((p * 100).toFixed(1))
          changeListItem(uid, {
            status: 'uploading',
            progress: progressNum,
            checkpoint: cpt
          })
          progressCallback && progressCallback(progressNum, cpt)
        }
      })
      .then(async (res) => {
        const originInfo = handleOssResponse(res?.res || {})
        if (originInfo.url) {
          const ossUrl = await getSignUrl({
            name: res.name
          })
          changeListItem(uid, {
            url: res.name,
            ossUrl
          })
          const warehousingParams: Partial<UploadItem> = {
            status: 'success'
          }

          // 上传成功后业务逻辑
          if (successCallback) {
            changeListItem(uid, {
              status: 'warehousing'
            })
            const { success, params } = await successCallback?.(getListItem(uid))
            warehousingParams.status = success ? 'success' : 'failed'
            if (success) {
              if (params)
                changeListItem(uid, params)
            } else {
              warehousingParams.failedCode = 1
              warehousingParams.failedMsg = '入库失败，请重新上传！'
            }
          }

          changeListItem(uid, warehousingParams)
        } else {
          changeListItem(uid, {
            failedCode: 0,
            status: 'failed',
            failedMsg: '上传失败，请重新上传！'
          })
        }
      })
      .catch((e) => {
        changeListItem(uid, {
          failedCode: 0,
          status: 'failed',
          failedMsg: e
        })
      })
  }

  return {
    dataList,
    uploadFile,
    resumeUpload,
    addListItem,
    removeListItem,
    batchRemoveListItem,
    changeListItem
  }
}
