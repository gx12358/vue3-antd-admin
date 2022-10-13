import type { Ref, ComputedRef } from 'vue'
import { computed, ref, unref, watch } from 'vue'
import { cloneDeep, omit } from 'lodash-es'
import { checkFileType, getMediaInfos, generateVidoePicture } from '@/utils/util'
import { isArray, isString } from '@/utils/validate'
import type { MaterialListItem, UploadList, UploadListRecord } from '../typings'
import type { GUploadProps } from '../Upload'

export function useUploadData(
  listRef: Ref<GUploadProps['dataList']>,
  propsRef: ComputedRef<GUploadProps>
) {
  const dataValue = ref<MaterialListItem[]>([])
  const getDataValueRef = computed(() => unref(dataValue))
  const getUrlValueRef = computed(() => unref(dataValue).filter(item => item.url)
    .map(item => item.url))

  watch(
    () => listRef.value,
    (data) => {
      if (isArray(data))
        getDataList(data)
      else
        console.warn('NOTE: dataList 不是数组类型')
    },
    {
      deep: true,
      immediate: true
    }
  )

  async function getDataList(list: UploadList) {
    const { coverDataList = [], limit, autoGetMediaParams, autoScreenshot } = unref(propsRef)
    const newUploadList = list.filter(item => dataValue.value.every(el => {
      if (isString(item)) return el?.url !== item
      return el?.url !== ((item as UploadListRecord)?.url || '')
    }))
      .filter(item => {
        if (isString(item)) return item
        return (item as UploadListRecord)?.url || ''
      })
    for (let i = 0; i < newUploadList.length; i += 1) {
      if (dataValue.value.length > limit - 1) return
      const uploadRecord = cloneDeep(newUploadList[i])
      const baseParams = getMediaBaseParams(uploadRecord)
      const initParams: MaterialListItem = {
        id: baseParams.url,
        url: baseParams.url,
        type: baseParams.type,
        progress: 100,
        spinning: baseParams.type === '3'
          ? autoGetMediaParams || autoScreenshot : autoGetMediaParams,
        uploadLoading: false,
        allowPlay: true,
        uploadStatus: 'success',
        ...baseParams.otherParams
      }
      dataValue.value.push(initParams)
      if (autoGetMediaParams) {
        getMediaOtherParams(uploadRecord, {
          url: baseParams.url,
          type: baseParams.type,
          autoScreenshot,
          ...baseParams.otherParams,
          coverImg: coverDataList[i] || (isString(uploadRecord)
            ? ''
            : (uploadRecord as UploadListRecord)?.coverImg)
        }).then(res => {
          changeDataValue({ value: baseParams.url }, { ...res })
          if (res.spinning) {
            getVideoScreenshots(baseParams.url, baseParams.url, false)
          }
        })
      } else {
        if (initParams.spinning) {
          getVideoScreenshots(baseParams.url, baseParams.url, false)
        }
      }
    }
  }

  function getMediaBaseParams(record: string | UploadListRecord) {
    const url = isString(record)
      ? record as string : ((record as UploadListRecord)?.url || '')
    const type = isString(record) ? checkFileType(url) : ((record as UploadListRecord)?.type || '')
    const otherParams = isString(record) ? {} : omit(record as UploadListRecord, 'url')
    return {
      url,
      type,
      otherParams
    }
  }

  async function getMediaOtherParams(record: string | UploadListRecord, params: RecordType) {
    const coverImg = isString(record)
      ? params.coverImg || '' : ((record as UploadListRecord)?.coverImg || '')
    const mediaInfo = await getMediaInfos({
      url: params.url,
      fileType: params.type
    })
    const width = isString(record)
      ? mediaInfo.width || 0 : ((record as UploadListRecord)?.width) || mediaInfo.width
    const height = isString(record)
      ? mediaInfo.height || 0 : ((record as UploadListRecord)?.height) || mediaInfo.height
    const duration = isString(record)
      ? mediaInfo.duration || 0 : ((record as UploadListRecord)?.duration) || mediaInfo.duration
    return {
      width,
      height,
      duration,
      spinning: params.type === '3' ? !!params.autoScreenshot : false,
      coverImg,
      allowPlay: mediaInfo.play
    }
  }

  async function getVideoScreenshots(id: string, url: string, isYield: boolean) {
    if (isYield) {
      const cover = await generateVidoePicture(url)
      changeDataValue({ value: id }, { coverImg: cover, spinning: false })
    } else {
      generateVidoePicture(url).then(cover => {
        changeDataValue({ value: id }, { coverImg: cover, spinning: false })
      })
    }
  }

  function setDataValue(list) {
    dataValue.value = cloneDeep(list)
  }

  function addDataValue(params: MaterialListItem) {
    dataValue.value.push({ ...params })
  }

  function changeDataValue({
    type = 'id',
    value
  } : {
    type?: 'id' | 'uid',
    value: string
  }, params: MaterialListItem) {
    dataValue.value = dataValue.value.map(item => {
      if ((type === 'id' ? item[type] : item.file.uid) === value) {
        return {
          ...item,
          ...params
        }
      }
      return item
    })
  }

  function batchChangeDataValue(list) {
    list.map(item => {
      dataValue.value = dataValue.value.map(el => {
        if (el.id === item.id) {
          return {
            ...el,
            ...omit(item, [ 'id' ])
          }
        }
        return el
      })
      return item
    })
  }

  function changeFileDataValue(file, params) {
    dataValue.value = dataValue.value.map(item => {
      if (item.name === file.name && item.size === file.size) {
        return {
          ...item,
          ...params
        }
      }
      return item
    })
  }

  function deleteDataValue(idName) {
    dataValue.value = dataValue.value.filter(item => item.id !== idName)
  }

  function deleteFileDataValue(file) {
    dataValue.value = dataValue.value.filter(item =>
      item.name !== file.name || item.size !== file.size)
  }

  return {
    getUrlValueRef,
    getDataValueRef,
    setDataValue,
    addDataValue,
    changeDataValue,
    batchChangeDataValue,
    changeFileDataValue,
    deleteDataValue,
    deleteFileDataValue
  }
}
