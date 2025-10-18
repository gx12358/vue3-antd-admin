import type { MaterialListItem } from '../typings'
import { CloudDownloadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { Dropdown, Menu, MenuItem, Progress } from 'ant-design-vue'
import Image from '@/components/GlobalLayout/Image'
import Spin from '@/components/GlobalLayout/Spin'
import { isDev } from '@/utils/env'
import { useUploadContext } from '../context'
import { proUploadProps } from '../props'

const UploadCard = defineComponent({
  props: {
    ...proUploadProps,
    root: {
      type: Object as PropType<Ref<HTMLDivElement | undefined>>,
    },
    prefixClass: {
      type: String as PropType<string>,
    },
    onView: {
      type: Function as PropType<(row: MaterialListItem) => void>,
    },
    onDelete: {
      type: Function as PropType<(row: MaterialListItem) => void>,
    },
    onDownload: {
      type: Function as PropType<(row: MaterialListItem) => void>,
    },
    onWaterMark: {
      type: Function as PropType<(row: MaterialListItem) => void>,
    },
    onMediaCropper: {
      type: Function as PropType<(row: MaterialListItem) => void>,
    }
  },
  setup(props) {
    const context = useUploadContext()

    const handleQuickEdit = (record) => {
      return record.type === '1' && !record.uploadLoading && props.showEditor && isDev()
    }

    const renderMaterial = (record: MaterialListItem) => {
      const imageStyle = { ...(props.imageStyle || props.cardItemStyle || {}) }
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

    const renderExtraMenu = (record: MaterialListItem) =>
      !props.disabled && (
        <Menu>
          {handleQuickEdit(record) && (
            <MenuItem onClick={() => props.onMediaCropper?.(record)}>
              <i class="material_font gx-tupianbianji" />
              <span style={{ marginLeft: '8px' }}>快编</span>
            </MenuItem>
          )}
          {(record.type === '1' || record.type === '3') && !record.uploadLoading && props.waterMark && (
            <MenuItem onClick={() => props.onWaterMark?.(record)}>
              <i class="material_font gx-shuiyin" />
              <span style={{ marginLeft: '8px' }}>水印</span>
            </MenuItem>
          )}
        </Menu>
      )

    return () => {
      return (
        <>
          {unref(context.uploadList)?.map((item, index) => {
            return (
              <Dropdown
                key={index}
                get-popup-container={() => props.root}
                trigger={[ 'contextmenu' ]}
                overlay={renderExtraMenu(item)}
              >
                <div
                  style={props.cardItemStyle}
                  class={{
                    [`${props.cardItemClass}`]: !!props.cardItemClass,
                    [`${props.prefixClass}-card-item`]: true,
                    [`${props.prefixClass}-card-item-circle`]: props.shape === 'circle'
                  }}
                >
                  {item.uploadLoading ? (
                    <div class={`${props.prefixClass}-card-item-loading`}>
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
                        [`${props.prefixClass}-card-item-wrapper`]: true,
                        [`${props.cardWrapperClass}`]: !!props.cardWrapperClass,
                        [`${props.prefixClass}-card-item-wrapper-disabled`]:
                          props.customOperationRender
                            ? true
                            : props.disabled && unref(context.uploadList)
                            .every(item => !item.url)
                      }}
                    >
                      {renderMaterial(item)}
                      {
                        (props.customOperationRender as any)?.({
                          row: item,
                          onView: () => props.onView?.(item),
                          onDownload: () => props.onDownload?.(item),
                          onDelete: () => props.onDelete?.(item)
                        }) || (
                          <div class={`${props.prefixClass}-card-item-wrapper-icons`}>
                            <>
                              {item.allowPlay && item.url && item.type !== '4' && props.showPreview && (
                                <EyeOutlined onClick={() => props.onView?.(item)} />
                              )}
                              {item.allowPlay && item.url && props.downloadProps !== false && (
                                <CloudDownloadOutlined onClick={() => props.onDownload?.(item)} />
                              )}
                              {props.showDelete && !props.disabled && (
                                <DeleteOutlined onClick={() => props.onDelete?.(item)} />
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
  }
})

export default UploadCard
