import type { CSSProperties, ExtractPropTypes, SlotsType } from 'vue'
import type { OperationRenderProps } from './props'
import type { MaterialListItem } from './typings'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  checkFileType, dataURLtoBlob,
  dataURLtoFile,
  getBase64,
  getBlobUrl,
  getFileSuffix,
  getMediaInfos,
  getPrefixCls,
  getSlot,
  getSlotsChildren,
  getSlotsProps,
  getSlotVNode,
  getVideoCoverPicture,
  isBoolean,
  isObject, merge
} from '@gx-design-vue/pro-utils'
import { message, Upload } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import {
  computed,
  defineComponent,
  onDeactivated,
  onUnmounted,
  reactive,
  ref,
  toRef,
  unref
} from 'vue'
import { global } from '@/common'
import { download } from '@/services/common'
import { createFileName } from '@/utils/uploadFile'
import MaterialView from '../MaterialView'
import UploadCard from './components/UploadCard'
import { provideUploadContext } from './context'
import { useUploadData } from './hooks/useUploadData'
import { cardSize, proUploadProps } from './props'

import './style.less'

export type GUploadProps = Partial<ExtractPropTypes<typeof proUploadProps>>

const GUpload = defineComponent({
  props: proUploadProps,
  inheritAttrs: false,
  slots: Object as SlotsType<{
    default(trigger: any): void;
    fallback(): void;
    wordExtra(): void;
    placeholder(): void;
    customOperationRender(props: OperationRenderProps): void;
    triggerRender(): void;
  }>,
  emits: [ 'deleteBefore', 'errorRequest', 'change', 'changeDownloadLoading', 'openFileDialog' ],
  setup(props, { emit, attrs, slots }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'upload'
    })

    const uploadCard = ref()
    const imageEditor = ref()

    const previewConfig = reactive({
      type: '' as MaterialListItem['type'],
      url: '',
      visible: false
    })

    const getClassName = computed(() => {
      return {
        [`${baseClassName}`]: true,
        [`${attrs.class}`]: attrs.class
      }
    })

    watch(() => props.dataExtraInfo, () => {
      handleProgress()
    }, { deep: true })

    const {
      getUrlValueRef,
      getDataValueRef,
      setDataValue,
      addDataValue,
      changeDataValue,
      batchChangeDataValue,
      changeFileDataValue,
      deleteDataValue,
      deleteFileDataValue
    } = useUploadData({
      limit: toRef(props, 'limit'),
      dataList: toRef(props, 'dataList'),
      bindValue: toRef(props, 'bindValue'),
      coverDataList: toRef(props, 'coverDataList')
    })

    const showUpload = computed(() => props.disabled ? false : props.listType === 'card'
      ? unref(getDataValueRef).length < props.limit
      : true)

    onUnmounted(() => {
      setDataValue([])
    })

    onDeactivated(() => {
      setDataValue([])
    })

    function handleProgress() {
      batchChangeDataValue(props.dataExtraInfo)
    }

    const beforeUpload = async (file) => {
      const fileSuffix = getFileSuffix(file.name)
      const fileType = checkFileType(file.name)
      let isFileType = true
      let isFileSize = true
      let isFileDuration = true
      if (props.fileType.length > 0) {
        if (props.fileType.length === 1 && props.fileType[0] === '*') {
          isFileType = true
        } else {
          isFileType = props.fileType.includes(fileSuffix.toLowerCase())
          if (!isFileType) {
            const fileName = props.fileType.join('，')
            message.error(
              `请选择${props.fileType.length === 1 ? fileName : `（${fileName}）`}格式上传!`
            )
          }
        }
      }
      isFileSize = props.fileSize ? file.size / 1024 / 1024 < props.fileSize : true
      if (!isFileSize) {
        message.error(`请上传${props.fileSize}MB以内的文件!`)
      }
      if ((fileType === '2' || fileType === '3') && isFileType && isFileSize) {
        let fileDuration = 0
        if (props.listType === 'card' || !getDataValueRef.value.length) {
          addDataValue({
            name: file.name,
            size: file.size,
            uploadLoading: true,
            spinning: true,
            loadingText: '正在准备中...'
          })
        } else {
          const uuid = getDataValueRef.value[0].id
          changeDataValue(uuid, {
            name: file.name,
            size: file.size,
            uploadLoading: true,
            spinning: true,
            loadingText: '正在准备中...'
          })
        }
        const { play, duration } = await getMediaInfos({
          url: file,
          fileType
        })
        if (play)
          fileDuration = duration || 0
        isFileDuration = props.fileDuration ? fileDuration < props.fileDuration : true
        if ((fileType === '2' || fileType === '3') && !isFileDuration) {
          message.error(`请上传${props.fileDuration}s以内的文件!`)
        }
      }
      return new Promise<File | boolean>((resolve, reject) => {
        if (isFileType && isFileSize && isFileDuration) {
          resolve(file)
        } else {
          reject(false)
          deleteFileDataValue(file)
        }
      })
    }

    const mediaCropper = async (uid, state?: { file: File; url: string }) => {
      const fileUrl = state?.url || unref(getDataValueRef).find(item => item.id === uid)?.url || ''
      const fileSuffix = getFileSuffix(fileUrl)
      imageEditor.value?.openModal(fileUrl, {
        suffix: fileSuffix,
        uid
      })
    }

    const uploadCoverImgHttp = async (file, uuid) => {
      if (props.request) {
        const response = await props.request(file, uuid)
        if (response.code === 0) {
          return response.previewUrl || response.url
        } else {
          emit('errorRequest', response)
        }
      }
      return ''
    }

    const handleChange = async (res: Partial<MaterialListItem>, uid) => {
      if (unref(getDataValueRef).find(item => item.id === uid)) {
        changeDataValue(uid, {
          uploadStatus: 'active',
          uploadLoading: true,
          spinning: true,
          loadingText: '获取信息中...'
        })
        const fileItem = unref(getDataValueRef).find(item => item.id === uid) as MaterialListItem
        const { name = '' } = fileItem
        let { coverImg = '' } = fileItem
        const { allowFormat, allowPlay } = fileItem
        if (coverImg) {
          const coverFile = dataURLtoFile(coverImg, `${name.split('.')[0]}_cover.png`)
          coverImg = await uploadCoverImgHttp(coverFile, uid)
        }
        changeDataValue(uid, {
          loadingText: '',
          uploadStatus: 'success',
          allowPlay,
          progress: 100,
          loadStatusMsg: allowFormat ? (allowPlay ? '' : '加载失败') : '无法在线预览',
          uploadLoading: false,
          ...res,
          coverImg
        })
        emit(
          'change',
          cloneDeep(unref(getUrlValueRef)),
          cloneDeep(unref(getDataValueRef))
        )
      } else {
        changeDataValue(uid, {
          loadingText: '',
          uploadStatus: 'exception',
          uploadLoading: false
        })
      }
    }

    const onDelete = async (record: MaterialListItem) => {
      if (record) {
        if (props.onDeleteBefore)
          await props.onDeleteBefore(record)
        deleteDataValue(record.id)
        emit(
          'change',
          cloneDeep(unref(getUrlValueRef)),
          cloneDeep(unref(getDataValueRef))
        )
      }
    }

    const requestUpload = async (file, row: MaterialListItem) => {
      const base64: string | ArrayBuffer | null = await getBase64(file)
      if (props.request) {
        const response = await props.request(
          file,
          row.id,
          unref(getDataValueRef).find(item => item.id === row.id)
        )
        if (response && response.code === 0) {
          handleChange({ ...response, localPreviewUrl: getBlobUrl(dataURLtoBlob(base64)) }, row.id)
        } else {
          emit('errorRequest', response)
          if (props.errorClean) {
            onDelete(row)
          } else {
            changeDataValue(row.id, {
              loadingText: '',
              uploadStatus: 'exception',
              uploadLoading: false
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
      let id = createFileName({
        file,
        name: type === '1' ? 'image' : type === '3' ? 'video' : 'audio'
      })
      const fileSuffix = getFileSuffix(file.name)
      let play = true
      let allowFormat = true
      let fileWidth = 0
      let fileHeight = 0
      let fileCoverImg = ''
      let fileDuration = 0
      const sizeSolt = (file.size / 1024 / 1024).toFixed(2)
      const videoNoExplan = global.videoAllowType.includes(fileSuffix.toLowerCase())
      const audioNoExplan = global.audioAllowType.includes(fileSuffix.toLowerCase())
      if (type === '1') {
        const mediaAttributes = await getMediaInfos({
          url: file,
          fileType: type
        })
        play = mediaAttributes.play
        if (play) {
          fileWidth = mediaAttributes.width || 0
          fileHeight = mediaAttributes.height || 0
        }
      }
      if (type === '2' || type === '3') {
        changeFileDataValue(file, {
          uploadLoading: true,
          spinning: true,
          readySuccess: false,
          loadingText: '正在准备中...'
        })
        if (type === '2') {
          allowFormat = fileSuffix
            ? global.audioAllowType.includes(fileSuffix.toLowerCase())
            : false
        }
        if (type === '3') {
          allowFormat = fileSuffix
            ? global.videoAllowType.includes(fileSuffix.toLowerCase())
            : false
        }
        const checkDuration = (type === '2' && audioNoExplan) || (type === '3' && videoNoExplan)
        if (checkDuration) {
          const mediaAttributes = await getMediaInfos({
            url: file,
            fileType: type
          })
          play = mediaAttributes.play
          if (play && type === '3') {
            fileCoverImg = await getVideoCoverPicture({
              url: file,
              videoAllowPlay: true
            })
          }
          fileDuration = play ? mediaAttributes.duration || 0 : 0
        }
        changeFileDataValue(file, {
          id,
          url: '',
          type,
          progress: 0,
          sizeSolt,
          allowFormat,
          allowPlay: play,
          uploadStatus: 'active',
          spinning: false,
          width: fileWidth,
          height: fileHeight,
          coverImg: fileCoverImg,
          duration: fileDuration
        })
      } else {
        if (props.listType === 'card' || !getDataValueRef.value.length) {
          addDataValue({
            id,
            url: '',
            type,
            file,
            loadingText: props.beforeEditable ? '正在快编中...' : '',
            progress: 0,
            uploadLoading: true,
            spinning: false,
            sizeSolt,
            allowFormat,
            allowPlay: play,
            uploadStatus: 'active',
            name: file.name,
            size: file.size,
            width: fileWidth,
            height: fileHeight
          })
        } else {
          id = getDataValueRef.value[0].id
          changeDataValue(id, {
            url: '',
            type,
            file,
            loadingText: props.beforeEditable ? '正在快编中...' : '',
            progress: 0,
            uploadLoading: true,
            spinning: false,
            sizeSolt,
            allowFormat,
            allowPlay: play,
            uploadStatus: 'active',
            name: file.name,
            size: file.size,
            width: fileWidth,
            height: fileHeight
          })
        }
      }
      if (props.beforeEditable && type === '1') {
        const base64: string | ArrayBuffer | null = await getBase64(file)
        mediaCropper(id, {
          file,
          url: getBlobUrl(dataURLtoBlob(base64))
        })
      } else {
        requestUpload(file, { id } as MaterialListItem)
      }
    }

    provideUploadContext({
      uploadList: getDataValueRef
    })

    const onView = (row: MaterialListItem) => {
      previewConfig.type = row.type
      previewConfig.url = row.url || ''
      previewConfig.visible = true
    }

    const downLoad = async (record: MaterialListItem) => {
      const url = isBoolean(props.downloadProps)
        ? record.previewUrl
        : props.downloadProps?.useLocal
          ? record.localPreviewUrl
          : record.previewUrl
      const name = isObject(props.downloadProps) && props.downloadProps?.useFileName
        ? record.name
        : undefined
      if (url) {
        emit('changeDownloadLoading', true)
        await download({
          url,
          name,
          direct: true
        })
        emit('changeDownloadLoading', false)
      }
    }

    const onWatermark = async (row: MaterialListItem) => {
      if (props.onWaterChange && row) {
        changeDataValue(row.id, {
          progress: 0,
          uploadStatus: 'active',
          uploadLoading: true,
          spinning: true,
          loadingText: '正在添加水印...'
        })
        const response = await props.onWaterChange(row)
        if (response && response.code === 0) {
          changeDataValue(row.id, {
            progress: 100,
            uploadStatus: 'success',
            uploadLoading: false,
            spinning: false,
            loadingText: '',
            url: response.url
          })
          emit(
            'change',
            cloneDeep(unref(getUrlValueRef)),
            cloneDeep(unref(getDataValueRef))
          )
        } else {
          emit('errorRequest', response)
          changeDataValue(row.id, {
            progress: 100,
            uploadStatus: 'success',
            uploadLoading: false,
            spinning: false,
            loadingText: ''
          })
        }
      }
    }

    const uploadRender = (children: any) => (
      <Upload
        class={`${baseClassName}-upload`}
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

    const renderUploadButton = () => {
      if (!showUpload.value)
        return null

      const children = getSlotsChildren(slots, 'default')
      const triggerRender = getSlotVNode({
        slots,
        props,
        key: 'triggerRender'
      })

      const uploadButtonRender = children?.length ? props.defaultUploadRender
        ? uploadRender(children)
        : slots.default?.(
          uploadRender(triggerRender || <PlusOutlined />)
        ) : null

      return (
        uploadButtonRender || (
          uploadRender(
            <div
              class={{
                [`${baseClassName}-button`]: true,
                [`${props.triggerClass}`]: !!props.triggerClass,
                [`${baseClassName}-button-disabled`]: props.disabled,
                [`${baseClassName}-button-circle`]: props.shape === 'circle'
              }}
              onClick={() => props.onOpenFileDialog?.()}
              style={merge(cardSize, props.triggerStyle)}
            >
              {triggerRender || <PlusOutlined />}
            </div>
          )
        )
      )
    }

    return () => {
      const slotsProps = getSlotsProps({
        slots,
        props,
        keys: [ 'wordExtra', 'fallback', 'placeholder' ]
      })
      const customOperationRender = getSlot({
        slots,
        props,
        key: 'customOperationRender'
      })
      return (
        <>
          <div style={{ ...(attrs.style as CSSProperties) }} class={getClassName.value}>
            <div
              ref={uploadCard}
              class={{
                [`${baseClassName}-card`]: true,
                [`${baseClassName}-card-more`]: props.limit > 1,
                [`${props.cardClassName}`]: props.cardClassName
              }}
            >
              {props.listType === 'card' && (
                <UploadCard
                  {...props}
                  placeholder={slotsProps.placeholder}
                  fallback={slotsProps.fallback}
                  prefixClass={baseClassName}
                  customOperationRender={customOperationRender}
                  root={uploadCard.value}
                  onView={row => onView(row)}
                  onDelete={uuid => onDelete(uuid)}
                  onDownload={downLoad}
                  onWaterMark={row => onWatermark(row)}
                  onMediaCropper={mediaCropper}
                />
              )}
              {renderUploadButton()}
            </div>
            {slotsProps.wordExtra && <div class={`${baseClassName}-word-extra`}>{slotsProps.wordExtra}</div>}
          </div>
          <MaterialView
            {...previewConfig}
            onChange={visible => (previewConfig.visible = visible)}
          />
        </>
      )
    }
  }
})
export default GUpload
