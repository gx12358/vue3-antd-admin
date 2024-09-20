import type { CustomRender, WithFalse } from '@gx-design-vue/pro-utils'
import type { CSSProperties, ExtractPropTypes, SlotsType } from 'vue'
import type { MaterialListItem } from './typings'
import global from '@/common/global'
import { download } from '@/services/common'
import { createFileName } from '@/utils/uploadFile'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  checkFileType,
  dataURLtoBlob,
  dataURLtoFile,
  getBase64,
  getBlobUrl,
  getFileSuffix,
  getMediaInfos,
  getPrefixCls,
  getRandomNumber,
  getSlot,
  getSlotVNode,
  getVideoCoverPicture
} from '@gx-design-vue/pro-utils'
import { message, Upload } from 'ant-design-vue'
import { cloneDeep, pick } from 'lodash-es'
import {
  computed,
  defineComponent,
  onDeactivated,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  unref
} from 'vue'
import MaterialView from '../MaterialView'
import ImageEditorModal from './components/ImageEditorModal'
import UploadCard from './components/UploadCard'
import { useUploadData } from './hooks/useUploadData'
import { proUploadProps } from './props'

import { provideUploadContext } from './UploadContext'

import './style.less'

export type GUploadProps = Partial<ExtractPropTypes<typeof proUploadProps>>

const GUpload = defineComponent({
  props: proUploadProps,
  inheritAttrs: false,
  slots: Object as SlotsType<{
    default: any;
    fallback: any;
    placeholder: any;
    customOperationRender: any;
    triggerRender: GUploadProps['triggerRender'];
  }>,
  emits: [ 'request', 'deleteBefore', 'errorRequest', 'change', 'downLoad', 'openFileDialog' ],
  setup(props, { emit, attrs, slots }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'upload'
    })

    const uploadCard = ref()
    const imageEditor = ref()

    const previewConfig = reactive({
      type: '',
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
    } = useUploadData(pick(toRefs(props), [ 'limit', 'dataList', 'bindValue', 'coverDataList' ]))

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
          return response.previewUrl
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

    const deleteFile = async (uuid) => {
      const fileUrl = unref(getDataValueRef).find(item => item.id === uuid)
      if (props.deleteBefore)
        await props.deleteBefore(fileUrl)
      deleteDataValue(uuid)
      emit(
        'change',
        cloneDeep(unref(getUrlValueRef)),
        cloneDeep(unref(getDataValueRef))
      )
    }

    const requestUpload = async (file, uid) => {
      const base64: string | ArrayBuffer | null = await getBase64(file)
      if (props.request) {
        const response = await props.request(
          file,
          uid,
          unref(getDataValueRef).find(item => item.id === uid)
        )
        if (response && response.code === 0) {
          handleChange({ ...response, localPreviewUrl: getBlobUrl(dataURLtoBlob(base64)) }, uid)
        } else {
          emit('errorRequest', response)
          if (props.errorClean) {
            deleteFile(uid)
          } else {
            changeDataValue(uid, {
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
        }, uid)
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
              vidoeAllowPlay: true
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
        requestUpload(file, id)
      }
    }

    const handleEditOk = async (base64Url: string, params: { suffix: string; uid: string }) => {
      changeDataValue(
        params.uid,
        {
          progress: 0,
          uploadStatus: 'active',
          uploadLoading: true
        }
      )

      const { width, height } = await getMediaInfos({
        fileType: '1',
        url: base64Url
      })
      const file: File = dataURLtoFile(
        base64Url,
        `${getRandomNumber().uuid(5)}.${params.suffix}`
      )
      const sizeSolt = (file.size / 1024 / 1024).toFixed(2)
      changeDataValue(
        params.uid,
        {
          width,
          height,
          sizeSolt,
          size: file.size
        }
      )
      requestUpload(file, params.uid)
    }

    provideUploadContext({
      uploadList: getDataValueRef
    })

    const view = (type, url) => {
      previewConfig.type = String(type)
      previewConfig.url = url
      previewConfig.visible = true
    }

    const downLoad = async (url) => {
      emit('downLoad', true)
      await download({
        url,
        direct: true
      })
      emit('downLoad', false)
    }

    const watermark = async (uuid, type) => {
      const fileUrl = unref(getDataValueRef).find(item => item.id === uuid)?.url || ''
      if (props.waterChange && fileUrl) {
        changeDataValue(uuid, {
          progress: 0,
          uploadStatus: 'active',
          uploadLoading: true,
          spinning: true,
          loadingText: '正在添加水印...'
        })
        const response = await props.waterChange(fileUrl, type)
        if (response && response.code === 0) {
          changeDataValue(uuid, {
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
          changeDataValue(uuid, {
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
        accept={props.accept}
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
      const triggerIconRender = getSlot<() => WithFalse<CustomRender>>(
        slots,
        props,
        'triggerRender'
      )

      const uploadButtonRender = slots.default?.() ? props.defaultUploadRender
        ? uploadRender(slots.default?.())
        : slots.default?.(
          uploadRender(triggerIconRender ? triggerIconRender?.() : <PlusOutlined />)
        ) : null

      return (
        uploadButtonRender || (
          uploadRender(
            <div
              class={{
                [`${baseClassName}-button`]: true,
                [`${baseClassName}-button-disabled`]: props.disabled,
                [`${baseClassName}-button-circle`]: props.shape === 'circle'
              }}
              onClick={() => props.onOpenFileDialog?.()}
              style={props.cardStyle}
            >
              {triggerIconRender ? triggerIconRender?.() : <PlusOutlined />}
            </div>
          )
        )
      )
    }

    return () => {
      const wordExtraRender = getSlotVNode(slots, props, 'wordExtra')
      const errorExtraRender = getSlotVNode<WithFalse<CustomRender>>(
        slots,
        props,
        'fallback'
      )
      const placeholderExtra = getSlotVNode<WithFalse<CustomRender>>(
        slots,
        props,
        'placeholder'
      )
      const customOperationRender = getSlot<GUploadProps['customOperationRender']>(
        slots,
        props,
        'customOperationRender'
      )
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
                  placeholder={placeholderExtra}
                  fallback={errorExtraRender}
                  baseClassName={baseClassName}
                  customOperationRender={customOperationRender}
                  root={uploadCard.value}
                  onView={(type, url) => view(type, url)}
                  onDelete={uuid => deleteFile(uuid)}
                  onDownload={url => downLoad(url)}
                  onWaterMark={(uuid, type) => watermark(uuid, type)}
                  onMediaCropper={mediaCropper}
                />
              )}
              {renderUploadButton()}
            </div>
            {wordExtraRender && <div class={`${baseClassName}-word-extra`}>{wordExtraRender}</div>}
          </div>
          <ImageEditorModal ref={imageEditor} onOk={handleEditOk} />
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
