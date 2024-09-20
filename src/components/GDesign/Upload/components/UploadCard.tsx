import type { FunctionalComponent as FC, Ref } from 'vue'
import type { GUploadProps } from '../Upload'
import Image from '@/components/GlobalLayout/Image'
import Spin from '@/components/GlobalLayout/Spin'
import { isDev } from '@/utils/env'
import { CloudDownloadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { Dropdown, Menu, MenuItem, Progress } from 'ant-design-vue'
import { computed, unref } from 'vue'
import { useUploadContext } from '../UploadContext'

type UploadCardProps = GUploadProps & {
  root: Ref
  fit: string;
  baseClassName: string;
  onView: (type, url) => void
  onDelete: (idName) => void
  onDownload: (url) => void
  onWaterMark: (idName, type) => void
  onMediaCropper: (name, info?: { file: File; url: string }) => void
}

const UploadCard: FC<UploadCardProps> = (props: UploadCardProps) => {
  const { root, onView, baseClassName, onDelete, onDownload, onWaterMark, onMediaCropper } = props

  const context = useUploadContext()

  const rootRef = computed(() => root)

  const handleQuickEdit = (record) => {
    return record.type === '1' && !record.uploadLoading && props.showEditor && isDev()
  }

  const renderMaterial = (record) => {
    const imageStyle = { ...(props.imageStyle || props.cardStyle || {}) }
    const { fallback, placeholder } = props

    let show
    switch (record.type) {
      case '1':
        show = (
          <Image
            fit={props.fit}
            style={{ ...imageStyle }}
            src={record.previewUrl || record.localPreviewUrl}
            fallback={fallback}
            placeholder={placeholder}
          />
        )
        break
      case '2':
        show = record.allowPlay && record.url ? (
          <div class="gx-image-slot">
            <i class="material_font gx-yinleyinpin" />
          </div>
        ) : (
          fallback || <div class="image-slot">{record.loadStatusMsg || '加载失败'}</div>
        )
        break
      case '3':
        show = record.allowPlay && record.url ? (
          <Image
            fit="cover"
            style={{ ...imageStyle }}
            src={record.coverImg}
            fallback={fallback}
            placeholder={placeholder}
          />
        ) : (
          fallback || <div class="image-slot">{record.loadStatusMsg || '加载失败'}</div>
        )
        break
      case '4':
        show = (
          <div class="gx-image-slot">
            <i class="material_font gx-qitawenjian" />
          </div>
        )
        break
      default:
        show = (
          <Image
            fit={props.fit}
            style={{ ...imageStyle }}
            src={record.previewUrl || record.localPreviewUrl}
            fallback={fallback}
            placeholder={placeholder}
          />
        )
        break
    }
    return show
  }

  const renderExtraMenu = record =>
    !props.disabled && (
      <Menu>
        {handleQuickEdit(record) && (
          <MenuItem onClick={() => onMediaCropper(record.id)}>
            <i class="material_font gx-tupianbianji" />
            <span style={{ marginLeft: '8px' }}>快编</span>
          </MenuItem>
        )}
        {(record.type === '1' || record.type === '3') && !record.uploadLoading && props.waterMark && (
          <MenuItem onClick={() => onWaterMark(record.id, record.type)}>
            <i class="material_font gx-shuiyin" />
            <span style={{ marginLeft: '8px' }}>水印</span>
          </MenuItem>
        )}
      </Menu>
    )

  return (
    <>
      {unref(context.uploadList)?.map((item, index) => {
        return (
          <Dropdown
            key={index}
            get-popup-container={() => rootRef.value}
            trigger={[ 'contextmenu' ]}
            overlay={renderExtraMenu(item)}
          >
            <div
              style={props.cardStyle}
              class={{
                [`${baseClassName}-card-item`]: true,
                [`${baseClassName}-card-item-circle`]: props.shape === 'circle'
              }}
            >
              {item.uploadLoading ? (
                <div class={`${baseClassName}-card-item-loading`}>
                  {item.spinning || !props.progress ? (
                    <Spin />
                  ) : (
                    props.progress && (
                      <Progress
                        size={70}
                        percent={item.progress}
                        status={item.uploadStatus}
                        type="circle"
                      />
                    )
                  )}
                </div>
              ) : (
                <div
                  class={{
                    [`${baseClassName}-card-item-wrapper`]: true,
                    [`${props.cardWrapperClass}`]: !!props.cardWrapperClass,
                    [`${baseClassName}-card-item-wrapper-disabled`]:
                      props.customOperationRender
                        ? true
                        : props.disabled && unref(context.uploadList)
                        .every(item => !item.url)
                  }}
                >
                  {renderMaterial(item)}
                  {
                    (props.customOperationRender as any)?.(
                      item,
                      () => onView(item.type, item.previewUrl),
                      () => onDownload(item.previewUrl),
                      () => onDelete(item.id)
                    ) || (
                      <div class={`${baseClassName}-card-item-wrapper-icons`}>
                        <>
                          {item.allowPlay && item.url && item.type !== '4' && props.showPreview && (
                            <EyeOutlined onClick={() => onView(item.type, item.previewUrl)} />
                          )}
                          {item.allowPlay && item.url && props.showDownload && (
                            <CloudDownloadOutlined onClick={() => onDownload(item.previewUrl)} />
                          )}
                          {props.showDelete && !props.disabled && (
                            <DeleteOutlined onClick={() => onDelete(item.id)} />
                          )}
                        </>
                      </div>
                    )
                  }
                </div>
              )}
            </div>
          </Dropdown>
        )
      })}
    </>
  )
}

export default UploadCard
