import type { Ref } from 'vue'
import type { MaterialListItem } from '../typings'
import type { GUploadProps } from '../Upload'
import { checkFileType, generateVideoPicture, isString } from '@gx-design-vue/pro-utils'
import { cloneDeep, omit } from 'lodash-es'
import { computed, ref, unref, watch } from 'vue'

export function useUploadData(state: {
  limit: Ref<GUploadProps['limit']>,
  dataList: Ref<GUploadProps['dataList']>,
  bindValue: Ref<GUploadProps['bindValue']>,
  coverDataList: Ref<GUploadProps['coverDataList']>
}) {
  const dataValue = ref<MaterialListItem[]>([])
  const getDataValueRef = computed(() => unref(dataValue))
  const getUrlValueRef = computed(() => unref(dataValue).filter(item => item.url).map(item => item.url))

  watch(
    () => state.dataList.value,
    (data) => {
      if (data) getDataList(data)
    },
    {
      deep: true,
      immediate: true
    }
  )

  async function getDataList(list: (string | MaterialListItem)[]) {
    if (state.bindValue.value)
      dataValue.value = []
    const newUploadList = list.filter(item => state.bindValue.value
      ? true
      : dataValue.value.every((el) => {
        if (isString(item))
          return el?.url !== item
        return el?.url !== (item?.url || '')
      })).filter((item) => {
      if (state.bindValue.value)
        return true
      if (isString(item))
        return item
      return item?.url || ''
    })
    for (let i = 0; i < newUploadList.length; i += 1) {
      if (dataValue.value.length > (state.limit.value || 15) - 1)
        return

      const row = isString(newUploadList[i]) ? {} as MaterialListItem : newUploadList[i] as MaterialListItem
      const url = isString(newUploadList[i]) ? newUploadList[i] as string : row?.url || ''
      const type = row?.type || checkFileType(url, '1')
      const coverImg = state.coverDataList?.value?.[i] || ''
      const otherParams = isString(newUploadList[i]) ? {} : omit(row, 'url')
      dataValue.value.push({
        id: url,
        url,
        previewUrl: isString(newUploadList[i]) ? url : (row?.previewUrl || url),
        localPreviewUrl: isString(newUploadList[i]) ? url : (row?.previewUrl || url),
        progress: 100,
        uploadLoading: false,
        allowPlay: true,
        coverImg,
        uploadStatus: 'success',
        ...otherParams,
        type
      } as MaterialListItem)

      if (!coverImg && type === '3') {
        generateVideoPicture(url).then((coverUrl) => {
          changeDataValue(url, { coverImg: coverUrl })
        })
      }
    }
  }

  function setDataValue(list) {
    dataValue.value = cloneDeep(list)
  }

  function addDataValue(params: Partial<MaterialListItem>) {
    dataValue.value.push({ ...params } as MaterialListItem)
  }

  function changeDataValue(id: MaterialListItem['id'], params: Partial<MaterialListItem>) {
    dataValue.value = dataValue.value.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...params
        }
      }
      return item
    })
  }

  function batchChangeDataValue(list) {
    list.map((item) => {
      dataValue.value = dataValue.value.map((el) => {
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
    dataValue.value = dataValue.value.map((item) => {
      if (item.name === file.name && item.size === file.size) {
        return {
          ...item,
          ...params
        }
      }
      return item
    })
  }

  function deleteDataValue(uuid) {
    dataValue.value = dataValue.value.filter(item => item.id !== uuid)
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
