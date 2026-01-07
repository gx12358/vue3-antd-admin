import type { Ref } from 'vue'
import type { GUploadProps } from '../props'
import type { MaterialListItem } from '../typings'
import {
  checkFileType,
  generateVideoPicture,
  isArray, isObject,
  isString
} from '@gx-design-vue/pro-utils'
import { cloneDeep, omit } from 'lodash-es'
import { computed, ref, unref, watch } from 'vue'

export function useUploadData(state: {
  list: Ref<GUploadProps['list']>,
  maxCount: Ref<GUploadProps['maxCount']>,
  coverList: Ref<GUploadProps['coverList']>
}) {
  const listValue = ref<MaterialListItem[]>([])
  const listUrlValue = computed(() => unref(listValue)
    .filter(item => item.url)
    .map(item => item.url))

  watch(() => state.list.value, (value) => {
    if (isArray(value)) handleDefaultList(value)
  }, { deep: true, immediate: true })

  async function handleDefaultList(list: (string | MaterialListItem)[]) {
    const newListValue = list.filter((row) => {
      return listValue.value.every((el) => {
        if (isString(row)) return el.url !== row
        return el.url !== row.url
      })
    }).filter((row) => {
      if (isString(row)) return row
      return row.url
    })
    for (let i = 0; i < newListValue.length; i += 1) {
      if (state.maxCount.value && i >= state.maxCount.value) return

      const row = isString(newListValue[i])
        ? {} as MaterialListItem
        : newListValue[i] as MaterialListItem
      const url = isString(newListValue[i]) ? newListValue[i] as string : row.url || ''
      const previewUrl = isString(newListValue[i]) ? newListValue[i] as string : row.previewUrl || ''
      const type = row?.type || checkFileType(url)
      const coverImg = state.coverList.value?.[i] || ''
      const otherParams = isString(newListValue[i]) ? {} : omit(row, 'url')
      // url 取/最后一位
      const name = isObject(newListValue[i])
        ? row.name || (previewUrl || url).split('/').pop()
        : (previewUrl || url).split('/').pop()
      listValue.value.push({
        id: url,
        url,
        name,
        previewUrl,
        localPreviewUrl: previewUrl,
        progress: 100,
        loading: false,
        allowPlay: true,
        coverImg,
        coverImageLoaded: coverImg ? 'success' : 'load',
        uploadStatus: 'success',
        ...otherParams,
        type
      } as MaterialListItem)

      if (!coverImg && type === '3') {
        generateVideoPicture(url).then((coverUrl) => {
          changeDataValue(
            url,
            { coverImg: coverUrl, coverImageLoaded: coverUrl ? 'success' : 'error' }
          )
        })
      }
    }
  }

  function setDataValue(list: MaterialListItem[]) {
    listValue.value = cloneDeep(list)
  }

  function addDataValue(params: Partial<MaterialListItem>) {
    listValue.value.push({ ...params } as MaterialListItem)
  }

  function changeDataValue(id: MaterialListItem['id'], params: Partial<MaterialListItem>) {
    listValue.value = listValue.value.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...params
        }
      }
      return item
    })
  }

  function batchChangeDataValue(list: (Partial<MaterialListItem>)[]) {
    list.map((item) => {
      listValue.value = listValue.value.map((el) => {
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

  function changeFileDataValue(file: File, params: Partial<MaterialListItem>) {
    listValue.value = listValue.value.map((item) => {
      if (item.name === file.name && item.size === file.size) {
        return {
          ...item,
          ...params
        }
      }
      return item
    })
  }

  function deleteDataValue(id: MaterialListItem['id']) {
    listValue.value = listValue.value.filter(item => item.id !== id)
  }

  function deleteFileDataValue(file: File) {
    listValue.value = listValue.value.filter(item =>
      item.name !== file.name || item.size !== file.size)
  }

  return {
    listValue,
    listUrlValue,
    setDataValue,
    addDataValue,
    changeDataValue,
    batchChangeDataValue,
    changeFileDataValue,
    deleteDataValue,
    deleteFileDataValue
  }
}
