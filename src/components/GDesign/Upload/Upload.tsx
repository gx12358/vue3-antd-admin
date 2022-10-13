import type { ExtractPropTypes, CSSProperties } from 'vue'
import {
  computed,
  defineComponent,
  onDeactivated,
  onUnmounted,
  ref,
  unref,
  reactive,
  toRef
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { message, Upload } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { download } from '@/services/common'
import global from '@/common/global'
import { useEffect } from '@gx-admin/hooks/core'
import { getPrefixCls, getSlotVNode } from '@gx-admin/utils'
import { fileName } from '@/utils/uploadFile'
import {
  checkFileType,
  getFileSuffix,
  getMediaInfos,
  getVideoCoverPicture,
  dataURLtoFile,
  getBase64,
  dataURLtoBlob,
  getBlobUrl,
  isBase64
} from '@/utils/util'
import type { MaterialListItem } from './typings'
import { proUploadProps } from './props'
import { provideUploadContext } from './UploadContext'
import { useUploadData } from './hooks/useUploadData'
import UploadCard from './components/UploadCard'

import './style.less'

export type GUploadProps = Partial<ExtractPropTypes<typeof proUploadProps>>

const GUpload = defineComponent({
  props: proUploadProps,
  emits: ['request', 'deleteBefore', 'errorRequest', 'change', 'downLoad'],
  setup(props, { emit, attrs, slots }) {
    const uploadCard = ref()
    const previewConfig = reactive({
      type: '',
      url: '',
      visible: false
    })
    const baseClassName = getPrefixCls({
      suffixCls: 'upload'
    })
    const getClassName = computed(() => {
      return {
        [`${baseClassName}`]: true,
        [`${attrs.class}`]: attrs.class
      }
    })
    const getProps = computed(() => cloneDeep(props))
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
    } = useUploadData(toRef(props, 'dataList'), getProps)
    onUnmounted(() => {
      setDataValue([])
    })
    onDeactivated(() => {
      setDataValue([])
    })
    const handleProgress = () => {
      batchChangeDataValue(getProps.value.progressInfo)
    }
    useEffect(() => {
      handleProgress()
    }, [() => getProps.value.progressInfo])

    const checkFilePublicPlay = (file: MaterialListItem['file']) => {
      let allowFormat = true
      const type = checkFileType(file.name)
      const fileSuffix = getFileSuffix(file.name)
      if (type === '2') {
        allowFormat = fileSuffix ? global.audioAllowType.includes(fileSuffix.toLowerCase()) : false
      }
      if (type === '3') {
        allowFormat = fileSuffix ? global.videoAllowType.includes(fileSuffix.toLowerCase()) : false
      }
      return allowFormat
    }

    const beforeUpload = async (file: MaterialListItem['file']) => {
      const fileSuffix = getFileSuffix(file.name)
      const fileType = checkFileType(file.name)
      let isFileType = true
      let isFileSize = true
      let isFileDuration = true
      if (props.fileType.length > 0) {
        if (props.fileType.length === 1 && props.fileType[0] == '*') {
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
      if (
        (fileType === '2' || fileType === '3') &&
        isFileType &&
        isFileSize &&
        props.autoGetMediaParams
      ) {
        let fileDuration = 0
        const allowFormat = checkFilePublicPlay(file)
        if (props.listType === 'card' || !getDataValueRef.value.length) {
          addDataValue({
            name: file.name,
            size: file.size,
            allowFormat,
            uploadLoading: true,
            spinning: true,
            loadingText: '正在准备中...'
          })
        } else {
          const uid = getDataValueRef.value[0].id
          changeDataValue(
            { value: uid },
            {
              name: file.name,
              size: file.size,
              allowFormat,
              uploadLoading: true,
              spinning: true,
              loadingText: '正在准备中...'
            }
          )
        }
        if (allowFormat) {
          const { play, duration, width, height } = await getMediaInfos({
            url: file,
            fileType
          })
          if (props.listType === 'card' || !getDataValueRef.value.length) {
            changeDataValue(
              {
                type: 'uid',
                value: file.uid
              },
              {
                width,
                allowFormat: play,
                height,
                duration
              }
            )
          }
          if (play) fileDuration = duration || 0
          isFileDuration = props.fileDuration ? fileDuration < props.fileDuration : true
          if (!isFileDuration) {
            message.error(`请上传${props.fileDuration}s以内的文件!`)
          }
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
    const uploadHttp = async ({ file }) => {
      const existRecord = unref(getDataValueRef).find((item) => item.file?.uid === file.uid)
      let uid = fileName(file)
      const type = checkFileType(file.name)
      let play = true
      const allowFormat = checkFilePublicPlay(file)
      let fileWidth = 0
      let fileHeight = 0
      let fileCoverImg = ''
      const sizeSolt = (file.size / 1024 / 1024).toFixed(2)
      if (type === '1' && props.autoGetMediaParams) {
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
      if (existRecord && existRecord.allowFormat) {
        if (type === '3' && props.autoScreenshot) {
          fileCoverImg = await getVideoCoverPicture({
            url: file,
            vidoeAllowPlay: true
          })
        }
        changeFileDataValue(file, {
          id: uid,
          url: '',
          type,
          progress: 0,
          sizeSolt,
          uploadStatus: 'active',
          spinning: false,
          coverImg: fileCoverImg
        })
      } else {
        const params: MaterialListItem = {
          url: '',
          type,
          file,
          loadingText: props.beforeEditable ? '正在快编中...' : '',
          progress: 0,
          uploadLoading: true,
          spinning: false,
          sizeSolt,
          allowFormat,
          allowPlay: allowFormat,
          uploadStatus: 'active',
          name: file.name,
          size: file.size,
          width: fileWidth,
          height: fileHeight
        }
        if (props.listType === 'card' || !getDataValueRef.value.length) {
          addDataValue({
            id: uid,
            ...params
          })
        } else {
          uid = getDataValueRef.value[0].id
          changeDataValue({ value: uid }, params)
        }
      }
      if (props.beforeEditable && type === '1') {
        const base64: string | ArrayBuffer | null = await getBase64(file)
        mediaCropper(uid, 'upload', {
          file,
          url: getBlobUrl(dataURLtoBlob(base64))
        })
      } else {
        requestUpload(file, 'upload', uid)
      }
    }
    const requestUpload = async (file, type, uid) => {
      if (props.request) {
        const response = await props.request(file, uid)
        if (response && response.code === 0) {
          if (type === 'quickEdit') {
            handleQuickEditChange(response, uid)
          } else {
            handleChange(response, uid)
          }
        } else {
          emit('errorRequest', response)
          if (props.errorClean) {
            deleteFile(uid)
          } else {
            changeDataValue(
              { value: uid },
              {
                loadingText: '',
                uploadStatus: 'exception',
                uploadLoading: false
              }
            )
          }
        }
      } else {
        const base64: string | ArrayBuffer | null = await getBase64(file)
        handleChange({ url: getBlobUrl(dataURLtoBlob(base64)) }, uid)
      }
    }
    const uploadCoverImgHttp = (file) => {
      if (props.request) {
        const response = props.request(file)
        if (response.code === 0) {
          return response.url
        } else {
          emit('errorRequest', response)
        }
      }
      return ''
    }
    const handleChange = async (res, uid) => {
      if (unref(getDataValueRef).find((item) => item.id === uid)) {
        changeDataValue(
          { value: uid },
          {
            uploadStatus: 'active',
            uploadLoading: true,
            spinning: true,
            loadingText: '获取信息中...'
          }
        )
        const fileItem = unref(getDataValueRef).find((item) => item.id === uid) as MaterialListItem
        const { name = '' } = fileItem
        let { coverImg = '' } = fileItem
        const { allowFormat, allowPlay } = fileItem
        if (coverImg && isBase64(coverImg)) {
          const coverFile = dataURLtoFile(coverImg, `${name.split('.')[0]}_cover.png`)
          coverImg = await uploadCoverImgHttp(coverFile)
        }
        changeDataValue(
          { value: uid },
          {
            loadingText: '',
            uploadStatus: 'success',
            allowPlay,
            loadStatusMsg: allowFormat ? (allowPlay ? '' : '加载失败') : '无法在线预览',
            uploadLoading: false,
            url: res.url,
            coverImg,
            spinning: false
          }
        )
        emit(
          'change',
          cloneDeep(unref(getUrlValueRef)),
          cloneDeep(unref(getDataValueRef)).filter((item) => item.url)
        )
      } else {
        changeDataValue(
          { value: uid },
          {
            loadingText: '',
            uploadStatus: 'exception',
            uploadLoading: false
          }
        )
      }
    }
    const handleQuickEditChange = async (res, uid) => {
      const mediaAttributes = await getMediaInfos({
        url: res.url
      })
      changeDataValue(
        { value: uid },
        {
          uploadStatus: 'success',
          allowPlay: mediaAttributes.play,
          uploadLoading: false,
          url: res.url
        }
      )
      emit(
        'change',
        cloneDeep(unref(getUrlValueRef)),
        cloneDeep(unref(getDataValueRef)).filter((item) => item.url)
      )
    }
    const imageQuickEdit = (file, uid) => {
      const sizeSolt = (file.size / 1024 / 1024).toFixed(2)
      changeDataValue(
        { value: uid },
        {
          sizeSolt,
          name: file.name,
          size: file.size,
          progress: 0,
          uploadStatus: 'active',
          uploadLoading: true
        }
      )
      return { file, uid }
    }
    const mediaCropper = async (name, type, info?: { file: File; url: string }) => {
      const fileUrl =
        info?.url || unref(getDataValueRef).find((item) => item.id === name)?.url || ''
      const fileName = fileUrl.split('/')[fileUrl.split('/').length - 1]
      const fileSuffix = fileName.split('.')[1]
      // @ts-ignore
      const ImageEditor = new FilerobotImageEditor(
        {
          language: 'zh-cn',
          translations: {
            'zh-cn': global.filerobotImageZnch
          }
        },
        {
          onBeforeComplete: (e) => {
            const imgData = e.canvas.toDataURL(`image/${fileSuffix}`)
            const { file, uid } = imageQuickEdit(dataURLtoFile(imgData, fileName), name)
            requestUpload(file, type, uid)
            ImageEditor.unmount()
          },
          onClose: (_) => {
            if (props.beforeEditable) requestUpload(info?.file, 'upload', name)
            return false
          },
          onError: (e) => {
            console.log(e)
          }
        }
      )
      ImageEditor.open(fileUrl)
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
        url: url,
        direct: true
      })
      emit('downLoad', false)
    }
    const watermark = async (uid, type) => {
      const fileUrl = unref(getDataValueRef).find((item) => item.id === uid)?.url || ''
      if (props.waterChange && fileUrl) {
        changeDataValue(
          { value: uid },
          {
            progress: 0,
            uploadStatus: 'active',
            uploadLoading: true,
            spinning: true,
            loadingText: '正在添加水印...'
          }
        )
        const response = await props.waterChange(fileUrl, type)
        if (response && response.code === 0) {
          changeDataValue(
            { value: uid },
            {
              progress: 100,
              uploadStatus: 'success',
              uploadLoading: false,
              spinning: false,
              loadingText: '',
              url: response.url
            }
          )
          emit(
            'change',
            cloneDeep(unref(getUrlValueRef)),
            cloneDeep(unref(getDataValueRef)).filter((item) => item.url)
          )
        } else {
          emit('errorRequest', response)
          changeDataValue(
            { value: uid },
            {
              progress: 100,
              uploadStatus: 'success',
              uploadLoading: false,
              spinning: false,
              loadingText: ''
            }
          )
        }
      }
    }
    const deleteFile = async (uid) => {
      const fileUrl = unref(getDataValueRef).find((item) => item.id === uid)
      if (props.deleteBefore) await props.deleteBefore(fileUrl)
      deleteDataValue(uid)
      emit(
        'change',
        cloneDeep(unref(getUrlValueRef)),
        cloneDeep(unref(getDataValueRef)).filter((item) => item.url)
      )
    }

    const renderUploadButton = () => {
      const uploadButtonRender = slots.default?.()
      return (
        uploadButtonRender || (
          <div
            class={{
              [`${baseClassName}-button`]: true,
              [`${baseClassName}-button-circle`]: props.shape === 'circle'
            }}
            style={props.imageStyle}
          >
            <PlusOutlined />
          </div>
        )
      )
    }

    return () => {
      const wordExtraRender = getSlotVNode(slots, props, 'wordExtra')
      const errorExtraRender = getSlotVNode<WithFalse<() => CustomRender>>(
        slots,
        props,
        'errorExtra'
      )
      const placeholderExtra = getSlotVNode<WithFalse<() => CustomRender>>(
        slots,
        props,
        'placeholderExtra'
      )
      return (
        <div
          style={{ ...props.uplaodStyle, ...(attrs.style as CSSProperties) }}
          class={getClassName.value}
        >
          <div
            ref={(e) => (uploadCard.value = e)}
            class={{
              [`${baseClassName}-card`]: true,
              [`${props.cardClassName}`]: props.cardClassName
            }}
          >
            {props.listType === 'card' && (
              <UploadCard
                {...getProps.value}
                placeholderExtra={placeholderExtra}
                errorExtra={errorExtraRender}
                baseClassName={baseClassName}
                root={uploadCard.value}
                onView={(type, url) => view(type, url)}
                onDelete={(uid) => deleteFile(uid)}
                onDownload={(url) => downLoad(url)}
                onWaterMark={(uid, type) => watermark(uid, type)}
                onMediaCropper={(name, type, info) => mediaCropper(name, type, info)}
              />
            )}
            {!props.viewUp && (
              <Upload
                class={`${baseClassName}-upload`}
                beforeUpload={(e) => beforeUpload(e)}
                customRequest={(e) => uploadHttp(e)}
                disabled={props.disabled}
                limit={1}
                showUploadList={false}
                name="file"
              >
                {props.listType === 'card'
                  ? unref(getDataValueRef).length < props.limit && renderUploadButton()
                  : renderUploadButton()}
              </Upload>
            )}
            <g-material-view
              {...previewConfig}
              onChange={(visible) => (previewConfig.visible = visible)}
            />
          </div>
          {wordExtraRender && <div class={`${baseClassName}-word-extra`}>{wordExtraRender}</div>}
        </div>
      )
    }
  }
})
export default GUpload
