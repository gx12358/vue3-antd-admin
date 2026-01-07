import type { CSSProperties, SlotsType } from 'vue'
import type { GMediaViewProps } from '../media-view'
import type { LimitProps, OperationRenderProps } from './props'
import type { MaterialListItem } from './typings'
import { PlusOutlined } from '@ant-design/icons-vue'
import { createFileName } from '@gx-core/shared/utils'
import { unit } from '@gx-design-vue/pro-provider'
import {
  checkFileType,
  classNames,
  dataURLtoBlob,
  dataURLtoFile,
  fileTypes,
  getBase64,
  getBlobUrl,
  getFileSuffix,
  getMediaInfos,
  getPrefixCls,
  getSlot,
  getSlotVNode,
  getVideoCoverPicture,
  isArray,
  isFunction,
  isNumber,
  isObject,
  isString,
  merge
} from '@gx-design-vue/pro-utils'
import { message as antMessage, Upload } from 'ant-design-vue'
import { cloneDeep, pick } from 'lodash-es'
import {
  computed,
  defineComponent,
  onDeactivated,
  onUnmounted,
  reactive,
  toRef,
  unref,
  watch
} from 'vue'
import { GMediaView } from '../media-view'
import CardItem from './components/CardItem'
import { provideUploadContext } from './context'
import { useUploadData } from './hooks/useUploadData'
import { proUploadProps } from './props'
import { useStyle } from './style'

const GUpload = defineComponent({
  props: proUploadProps,
  inheritAttrs: false,
  slots: Object as SlotsType<{
    default(triggerIcon: any): void;
    fallback(props: MaterialListItem): void;
    placeholder(props: MaterialListItem): void;
    triggerIcon(): void;
    dropdownMenu(props: MaterialListItem): void;
    actionsRender(props: OperationRenderProps): void;
  }>,
  emits: [ 'deleteBefore', 'errorRequest', 'change', 'changeDownloadLoading', 'openFileDialog' ],
  setup(props, { emit, attrs, slots, expose }) {
    const baseClassName = getPrefixCls({
      isPor: true,
      suffixCls: 'upload'
    })

    const { wrapSSR, hashId } = useStyle(baseClassName, props.cardProps?.borderRadius)

    const previewConfig = reactive<GMediaViewProps>({
      type: '1',
      list: [],
      open: false
    })

    watch(() => props.dataExtraInfo, () => {
      handleProgress()
    }, { deep: true })

    const {
      listValue,
      listUrlValue,
      setDataValue,
      addDataValue,
      changeDataValue,
      batchChangeDataValue,
      changeFileDataValue,
      deleteDataValue,
      deleteFileDataValue
    } = useUploadData({
      list: toRef(props, 'list'),
      maxCount: toRef(props, 'maxCount'),
      coverList: toRef(props, 'coverList')
    })

    const showUploadSelect = computed(() => {
      return props.disabled ? false : props.listType === 'card' && props.maxCount
        ? unref(listValue).length < props.maxCount
        : true
    })

    onUnmounted(() => {
      setDataValue([])
    })

    onDeactivated(() => {
      setDataValue([])
    })

    function handleProgress() {
      batchChangeDataValue(props.dataExtraInfo)
    }

    const beforeUpload = async (file: File) => {
      const fileSuffix = getFileSuffix(file.name)
      const fileType = checkFileType(file.name)
      let allow = true
      let allowType = true
      let allowSize = true
      let allowDuration = true

      if (isFunction(props.limit)) {
        const status = await props.limit(file)
        allow = status
      } else if (isObject(props.limit)) {
        const {
          type,
          size,
          duration,
          message
        } = props.limit as LimitProps

        // 这里处理文件类型
        if (type) {
          if (isString(type)) {
            if (type !== '*') {
              allowType = fileSuffix.toLowerCase() === type
            }
          } else if (isArray(type)) {
            allowType = type.includes(fileSuffix.toLowerCase())
          } else if (isFunction(type)) {
            allowType = type(file)
          }
        }

        if (size && allowType) {
          const fileSize = file.size / 1024 / 1024
          if (isNumber(size)) {
            allowSize = fileSize < size
          } else if (isFunction(size)) {
            allowSize = size(file)
          }
        }

        if (allowType && allowSize && (fileType === '2' || fileType === '3') && duration) {
          let fileDuration = 0
          const name = file.name
          if (props.listType === 'card' || listValue.value.length === 0) {
            addDataValue({
              name,
              size: file.size,
              loading: true,
              coverImageLoaded: fileType === '3' ? 'load' : 'success',
              message: '正在准备中...'
            })
          } else {
            // 直接替换第一个
            const uuid = listValue.value[0].id
            changeDataValue(uuid, {
              name,
              size: file.size,
              loading: true,
              message: '正在准备中...'
            })
          }

          const result = await getMediaInfos({ url: file, fileType })
          if (result.play) fileDuration = result.duration || 0

          if (isNumber(duration)) {
            allowDuration = fileDuration < duration
          } else if (isFunction(duration)) {
            allowDuration = duration(file)
          }
        }

        if (!allowType) {
          antMessage.error(isFunction(message)
            ? message('type', file)
            : message || '上传文件格式不正确')
        } else if (!allowSize) {
          antMessage.error(isFunction(message)
            ? message('size', file)
            : message || '上传文件格式不正确')
        } else if (!allowDuration) {
          antMessage.error(isFunction(message)
            ? message('duration', file)
            : message || '上传文件格式不正确')
        }

        allow = allowType && allowSize && allowDuration
      }

      return new Promise<File | boolean>((resolve, reject) => {
        if (allow) {
          resolve(file)
        } else {
          reject(false)
          deleteFileDataValue(file)
        }
      })
    }

    const uploadCoverImgHttp = async (file, uuid) => {
      if (props.request) {
        const result = await props.request(file, uuid)
        if (result.code === 200) {
          return result.data.previewUrl || result.data.url
        } else {
          emit('errorRequest', result)
        }
      }
      return ''
    }

    const handleChange = async (res: Partial<MaterialListItem>, id) => {
      if (unref(listValue).find(item => item.id === id)) {
        changeDataValue(id, {
          uploadStatus: 'active',
          loading: true,
          message: '获取信息中...'
        })
        const row = unref(listValue).find(item => item.id === id) as MaterialListItem
        let coverImg = row.coverImg
        const { allowPlay } = row
        if (coverImg) {
          const coverFile = dataURLtoFile(coverImg, `${row.name?.split('.')[0]}_cover.png`)
          coverImg = await uploadCoverImgHttp(coverFile, id)
        }
        changeDataValue(id, {
          uploadStatus: 'success',
          allowPlay,
          progress: 100,
          message: allowPlay ? '' : '无法在线预览',
          loading: false,
          ...res,
          coverImg
        })
        emit('change', cloneDeep(unref(listUrlValue)), cloneDeep(unref(listValue)))
      } else {
        changeDataValue(id, {
          message: '',
          uploadStatus: 'exception',
          loading: false
        })
      }
    }

    const requestUpload = async (file, row: MaterialListItem) => {
      const base64: string | ArrayBuffer | null = await getBase64(file)
      if (props.request) {
        const response = await props.request(file, row)
        if (response && response.code === 200) {
          handleChange({ ...response, localPreviewUrl: getBlobUrl(dataURLtoBlob(base64)) }, row.id)
        } else {
          emit('errorRequest', response)
          if (props.errorClean) {
            onDelete(row)
          } else {
            changeDataValue(row.id, {
              message: '',
              uploadStatus: 'exception',
              loading: false
            })
          }
        }
      } else {
        handleChange({
          url: getBlobUrl(dataURLtoBlob(base64)),
          previewUrl: getBlobUrl(dataURLtoBlob(base64)),
          localPreviewUrl: getBlobUrl(dataURLtoBlob(base64))
        }, row.id)
      }
    }

    const uploadHttp = async ({ file }) => {
      const type = checkFileType(file.name)
      let id: string | number = createFileName({
        file,
        name: type === '1' ? 'image' : type === '3' ? 'video' : 'audio'
      })
      const fileSuffix = getFileSuffix(file.name).toLowerCase()
      let allowPlay = true
      let fileWidth = 0
      let fileHeight = 0
      let fileCoverImg = ''
      let fileDuration = 0
      const sizeSolt = (file.size / 1024 / 1024).toFixed(2)
      const allowFormat = type === '2' || type === '3'
        ? fileTypes[type === '2' ? 'audioAllowType' : 'videoAllowType'].includes(fileSuffix)
        : true
      if (type === '1') {
        const result = await getMediaInfos({
          url: file,
          fileType: type
        })
        allowPlay = result.play
        if (result.play) {
          fileWidth = result.width || 0
          fileHeight = result.height || 0
        }
      }

      if (type === '2' || type === '3') {
        changeFileDataValue(file, {
          loading: true,
          message: '正在准备中...'
        })
        if (['2', '3'].includes(type) && allowFormat) {
          const result = await getMediaInfos({ url: file, fileType: type })
          allowPlay = result.play
          if (result.play && type === '3') {
            fileCoverImg = await getVideoCoverPicture({
              url: file,
              videoAllowPlay: true
            })
          }
          fileDuration = result.play ? result.duration || 0 : 0
        }
        changeFileDataValue(file, {
          id,
          url: '',
          type,
          progress: 0,
          sizeSolt,
          uploadStatus: 'active',
          loading: true,
          allowPlay: allowPlay ? allowFormat : false,
          width: fileWidth,
          height: fileHeight,
          coverImg: fileCoverImg,
          coverImageLoaded: fileCoverImg ? 'success' : 'error',
          duration: fileDuration
        })
      } else {
        if (props.listType === 'card' || listValue.value.length === 0) {
          addDataValue({
            id,
            url: '',
            type,
            file,
            progress: 0,
            loading: true,
            sizeSolt,
            allowPlay,
            uploadStatus: 'active',
            name: file.name,
            size: file.size,
            width: fileWidth,
            height: fileHeight
          })
        } else {
          id = listValue.value[0].id
          changeDataValue(id, {
            url: '',
            type,
            file,
            progress: 0,
            loading: true,
            sizeSolt,
            allowPlay,
            uploadStatus: 'active',
            name: file.name,
            size: file.size,
            width: fileWidth,
            height: fileHeight
          })
        }
      }
      requestUpload(file, { id } as MaterialListItem)
    }

    const onView = (row: MaterialListItem) => {
      previewConfig.type = row.type as any
      previewConfig.list = [
        {
          url: row.previewUrl || row.localPreviewUrl || '',
          name: row.name
        }
      ]
      previewConfig.open = true
    }

    const onDownload = async (row: MaterialListItem) => {
      const url = row.previewUrl || row.localPreviewUrl
      const name = props.createFileName ? props.createFileName(row) : row.name
      if (url && props.download) {
        props.onChangeLoading?.(true)
        await props.download?.({ url, name })
        props.onChangeLoading?.(false)
      }
    }

    async function onDelete(row: MaterialListItem) {
      if (row) {
        if (props.onDeleteBefore) await props.onDeleteBefore(row)
        deleteDataValue(row.id)
        emit('change', cloneDeep(unref(listUrlValue)), cloneDeep(unref(listValue)))
      }
    }

    const renderUploadSelect = (children: any) => (
      <Upload
        class={classNames(`${baseClassName}-select`, hashId.value)}
        beforeUpload={e => beforeUpload(e)}
        customRequest={e => uploadHttp(e)}
        disabled={props.disabled}
        maxCount={1}
        accept={props.accept || undefined}
        multiple={props.multiple}
        showUploadList={false}
        name="file"
      >
        {children}
      </Upload>
    )

    provideUploadContext({
      list: listValue,
      onView,
      onDownload,
      onDelete,
    })

    const renderTrigger = () => {
      const { width, height } = props.cardProps
      const children = getSlot({ slots, props, key: 'default' })
      const triggerIcon = getSlotVNode({ slots, props, key: 'triggerIcon' })

      return (
        children && isFunction(children)
          ? renderUploadSelect(children?.(triggerIcon || <PlusOutlined />))
          : (
            renderUploadSelect(
              <div
                class={classNames({
                  [`${baseClassName}-trigger`]: true,
                  [`${baseClassName}-trigger-disabled`]: props.disabled,
                  [`${baseClassName}-trigger-circle`]: props.shape === 'circle'
                }, hashId.value, props.triggerClass)}
                onClick={() => props.onOpenFileDialog?.()}
                style={merge({ width: unit(width), height: unit(height) }, props.triggerStyle)}
              >
                {triggerIcon || <PlusOutlined />}
              </div>
            )
          )
      )
    }

    expose({
      onView,
      onDelete,
      onDownload,
      setDataValue,
      addDataValue,
      changeDataValue,
      deleteDataValue,
      changeFileDataValue,
      deleteFileDataValue,
      batchChangeDataValue,
    })

    return () => {
      const fallback = getSlot({ slots, props, key: 'fallback' })
      const placeholder = getSlot({ slots, props, key: 'placeholder' })
      const dropdownMenu = getSlot({ slots, props, key: 'dropdownMenu' })
      const actionsRender = getSlot({ slots, props, key: 'actionsRender' })

      return wrapSSR(
        <div class={classNames(`${baseClassName}-wrapper-container`, hashId.value)}>
          <div
            {...attrs}
            style={attrs.style as CSSProperties}
            class={classNames(hashId.value, baseClassName, attrs.class || '')}
          >
            <div
              class={classNames({
                [`${baseClassName}-wrapper`]: true,
                [`${baseClassName}-wrapper-more`]: listValue.value.length > 1,
                [`${baseClassName}-card-list`]: props.listType === 'card'
              }, hashId.value, props.wrapperClassName)}
            >
              {props.listType === 'card' && (
                <>
                  {listValue.value.map(item => (
                    <CardItem
                      key={item.id}
                      row={item}
                      {...pick(props, 'cardProps', 'actions', 'progress', 'shape')}
                      fallback={fallback}
                      placeholder={placeholder}
                      hashId={hashId.value}
                      prefixClass={baseClassName}
                      dropdownMenu={dropdownMenu}
                      actionsRender={actionsRender}
                    />
                  ))}
                </>
              )}
              {showUploadSelect.value && renderTrigger()}
            </div>
          </div>
          <GMediaView
            {...previewConfig}
            onChange={val => (previewConfig.open = val)}
          />
        </div>
      )
    }
  }
})
export default GUpload
